import { KanbanResponse, CreateKanbanRequest, UpdateKanbanRequest, toKanbanResponse, SearchKanbanRequest, KanbanRawEntry } from "../model/kanban-model";
import { Validation } from "../validation/validation";
import { KanbanValidation } from "../validation/kanban-validation";
import { prismaClient } from "../application/database";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";
import xlsx from 'xlsx';


export class KanbanService {

    static async createFromRequest(request: CreateKanbanRequest): Promise<KanbanResponse> {
        const createRequest = Validation.validate(KanbanValidation.CREATE, request);

        // Validasi unique: part_code
        const isCodeExist = await prismaClient.kanban.findUnique({
            where: { code: createRequest.code }
        });
        if (isCodeExist) {
            throw new ResponseError(400, "Code already exist");
        }

        // Validasi foreign key: rack_id
        const isRackExist = await prismaClient.rack.findUnique({
            where: { id: createRequest.rack_id }
        });
        if (!isRackExist) {
            throw new ResponseError(404, "Rack not found");
        }


        // Validasi foreign key: machine_area_id
        const isMachineAreaExist = await prismaClient.machineArea.findUnique({
            where: { id: createRequest.machine_area_id }
        });
        if (!isMachineAreaExist) {
            throw new ResponseError(404, "Machine Area not found");
        }

        // Validasi foreign key: machine_id
        const isMachineExist = await prismaClient.machine.findUnique({
            where: { id: createRequest.machine_id }
        });
        if (!isMachineExist) {
            throw new ResponseError(404, "Machine not found");
        }


        const Kanban = await prismaClient.kanban.create({
            data: createRequest,
            include: {
                rack: true,
                machine_area: true,
                machine: true,
                supplier: true,
                maker: true

            }
        });

        return toKanbanResponse(Kanban);
    }

    static async create(filePath: string) {

        const workbook: xlsx.WorkBook = xlsx.readFile(filePath);

        const sheet: xlsx.WorkSheet = workbook.Sheets["Sheet1"];

        if (!sheet) {
            logger.error("MASTER MATERIAL sheet not found");
            throw new Error("MASTER MATERIAL sheet not found");
        }

        const data: any[][] = xlsx.utils.sheet_to_json(sheet, {
            header: 1,
        });

        const headers: string[] = data[1] as string[];

        const importantHeaders: string[] = [
            "CODE JS SYSTEM",
            "UoM",
            "Minimal Stock",
            "Maximal Stock",
        ];

        const missingHeaders: string[] = importantHeaders.filter((h) => !headers.includes(h));
        if (missingHeaders.length > 0) {
            logger.error(`Missing important headers: ${missingHeaders.join(", ")}`);
            throw new Error(`Missing important headers: ${missingHeaders.join(", ")}`);
        }

        const kanbans: KanbanRawEntry[] = [];

        for (let i = 2; i < data.length; i++) {
            if (data[i].length !== headers.length) continue;

            const kanbanTemp: KanbanRawEntry = {};

            for (let j = 0; j < headers.length; j++) {
                kanbanTemp[headers[j]] = data[i][j];
            }

            kanbans.push(kanbanTemp);
        }


        const parseNumber = (val: string): number =>
            Number(val);

        const parseString = (val: string): string =>
            val.toString()

        const isValidProductCode = (code: string): boolean => {
            const prefix = code.split("-")[0];
            return prefix === "EA";
        };


        const supplierNames = Array.from(new Set(
            kanbans
                .map((entry) => parseString(entry.SUPPLIER))
                .filter((s): s is string => !!s)
        ));

        const existingSuppliers = await prismaClient.supplier.findMany({
            where: { name: { in: supplierNames } },
            select: { id: true, name: true }
        });

        const existingSupplierMap = new Map(existingSuppliers.map(s => [s.name, s.id]));

        const newSupplierNames = supplierNames.filter(name => !existingSupplierMap.has(name));

        const newSuppliers = await prismaClient.$transaction(async (tx) => {
            return await tx.supplier.createMany({
                data: newSupplierNames.map(name => ({ name })),
                skipDuplicates: true
            }).then(() =>
                tx.supplier.findMany({
                    where: { name: { in: newSupplierNames } },
                    select: { id: true, name: true }
                })
            );
        });

        newSuppliers.forEach(s => existingSupplierMap.set(s.name, s.id));


        const makerNames = Array.from(new Set(
            kanbans
                .map((entry) => parseString(entry.MAKER))
                .filter((s): s is string => !!s)
        ));

        const existingMakers = await prismaClient.maker.findMany({
            where: { name: { in: makerNames } },
            select: { id: true, name: true }
        });

        const existingMakerMap = new Map(existingMakers.map(s => [s.name, s.id]));

        const newMakerNames = makerNames.filter(name => !existingMakerMap.has(name));

        const newMakers = await prismaClient.$transaction(async (tx) => {
            return await tx.maker.createMany({
                data: newMakerNames.map(name => ({ name })),
                skipDuplicates: true
            }).then(() =>
                tx.maker.findMany({
                    where: { name: { in: newMakerNames } },
                    select: { id: true, name: true }
                })
            );
        });

        newMakers.forEach(s => existingMakerMap.set(s.name, s.id));





        const areaNames = Array.from(new Set(
            kanbans
                .map((entry) => parseString(entry.AREA))
                .filter((s): s is string => !!s)
        ));

        const existingAreas = await prismaClient.machineArea.findMany({
            where: { name: { in: areaNames } },
            select: { id: true, name: true }
        });

        const existingAreaMap = new Map(existingAreas.map(s => [s.name, s.id]));

        const newAreaNames = areaNames.filter(name => !existingAreaMap.has(name));

        const newAreas = await prismaClient.$transaction(async (tx) => {
            return await tx.machineArea.createMany({
                data: newAreaNames.map(name => ({ name })),
                skipDuplicates: true
            }).then(() =>
                tx.machineArea.findMany({
                    where: { name: { in: newMakerNames } },
                    select: { id: true, name: true }
                })
            );
        });

        newAreas.forEach(s => existingAreaMap.set(s.name, s.id));





        const machineNames = Array.from(new Set(
            kanbans
                .map((entry) => parseString(entry.MESIN))
                .filter((s): s is string => !!s)
        ));

        const existingMachines = await prismaClient.machine.findMany({
            where: { code: { in: machineNames } },
            select: { id: true, code: true }
        });

        const existingMachineMap = new Map(existingMachines.map(s => [s.code, s.id]));

        const newMachineNames = machineNames.filter(code => !existingMachineMap.has(code));

        const newMachines = await prismaClient.$transaction(async (tx) => {
            return await tx.machine.createMany({
                data: newMachineNames.map(code => ({ code })),
                skipDuplicates: true
            }).then(() =>
                tx.machine.findMany({
                    where: { code: { in: newMachineNames } },
                    select: { id: true, code: true }
                })
            );
        });

        newMachines.forEach(s => existingMachineMap.set(s.code, s.id));






        const rackNames = Array.from(new Set(
            kanbans
                .map((entry) => parseString(entry["CODE RACK"]))
                .filter((s): s is string => !!s)
        ));

        const existingRacks = await prismaClient.rack.findMany({
            where: { code: { in: rackNames } },
            select: { id: true, code: true }
        });

        const existingRackMap = new Map(existingRacks.map(s => [s.code, s.id]));

        const newRackNames = rackNames.filter(code => !existingRackMap.has(code));

        const newRacks = await prismaClient.$transaction(async (tx) => {
            return await tx.rack.createMany({
                data: newRackNames.map(code => ({ code })),
                skipDuplicates: true
            }).then(() =>
                tx.rack.findMany({
                    where: { code: { in: newRackNames } },
                    select: { id: true, code: true }
                })
            );
        });

        newRacks.forEach(s => existingRackMap.set(s.code, s.id));

        const kanbanFormattedResult: CreateKanbanRequest[] = kanbans
            .filter((entry: KanbanRawEntry) => entry["CODE JS SYSTEM"] !== undefined && isValidProductCode(entry["CODE JS SYSTEM"]))
            .map((entry: KanbanRawEntry) => {

                const supplierName = parseString(entry.SUPPLIER);
                const supplier_id = supplierName ? existingSupplierMap.get(supplierName) : undefined;

                const makerName = parseString(entry.MAKER);
                const maker_id = makerName ? existingMakerMap.get(makerName) : undefined;


                const areaName = parseString(entry.AREA);
                const area_id = areaName ? existingAreaMap.get(areaName) : undefined;


                const machineName = parseString(entry.MESIN);
                const machine_id = machineName ? existingMachineMap.get(machineName) : undefined;


                const rackName = parseString(entry["CODE RACK"]);
                const rack_id = rackName ? existingRackMap.get(rackName) : undefined;

                return {
                    code: parseString(entry["CODE JS SYSTEM"]),
                    uom: parseString(entry.UoM),
                    min_quantity: parseNumber(entry["Minimal Stock"]),
                    max_quantity: parseNumber(entry["Maximal Stock"]),
                    balance: parseNumber(entry["BEGINING BALANCE"]),
                    lead_time: parseNumber(entry["Lead Time"]),
                    description: parseString(entry.DESCRIPTION),
                    specification: parseString(entry.SPESIFICATION),
                    supplier_id: supplier_id,
                    maker_id: maker_id,
                    area_id: area_id,
                    machine_id: machine_id,
                    machine_area_id: area_id,
                    rack_id: rack_id,
                    safety_stock: parseNumber(entry["Safety Stock"]),
                    order_point: parseNumber(entry["Order Point"]),
                    rank: parseString(entry.RANK),
                    currency: parseString(entry.CURRENCY),
                    price: parseNumber(entry.PRICE),
                }
            });

        console.log(kanbanFormattedResult)


        try {
            const createRequest = Validation.validate(KanbanValidation.CREATE_MULTIPLE, kanbanFormattedResult);

            const kanbanCodes = createRequest.map(s => s.code);



            const existingKanbans = await prismaClient.kanban.findMany({
                where: { code: { in: kanbanCodes } },
                select: { id: true, code: true }
            });

            const existingKanbanSet = new Set(existingKanbans.map(s => s.code));
            const invalidKanbanCodes = kanbanCodes.filter(code => existingKanbanSet.has(code));


            if (invalidKanbanCodes.length > 0) {
                logger.warn("Kanban with code " + invalidKanbanCodes.join(", ") + " already exist");
            }

            if (invalidKanbanCodes.length === kanbanCodes.length) {
                logger.error("All kanban already exist");
                throw new Error("All kanban already exist");
            }


            const validRequest = createRequest.filter(s => !existingKanbanSet.has(s.code));

            await prismaClient.$transaction(
                validRequest.map(({ rack_id, maker_id, machine_id, machine_area_id, supplier_id, ...rest }) =>
                    prismaClient.kanban.create({
                        data: {
                            ...rest,
                            ...(supplier_id && { supplier: { connect: { id: supplier_id } } }),
                            ...(rack_id && { rack: { connect: { id: rack_id } } }),
                            ...(maker_id && { maker: { connect: { id: maker_id } } }),
                            ...(machine_id && { machine: { connect: { id: machine_id } } }),
                            ...(machine_area_id && { machine_area: { connect: { id: machine_area_id } } }),
                        }
                    })
                )
            );

            return true;


        } catch (error) {
            logger.error("Error while create kanban master data: " + error);
            throw new ResponseError(400, "Invalid request");

        }
    }


    static async update(id: number, request: UpdateKanbanRequest): Promise<KanbanResponse> {

        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const idISValid = await prismaClient.kanban.findUnique({
            where: {
                id: id
            }
        });

        if (!idISValid) {
            throw new ResponseError(400, "Kanban not found");
        }

        const updateRequest = Validation.validate(KanbanValidation.UPDATE, request);

        // Validasi unique: part_code
        const isPartExist = await prismaClient.kanban.findUnique({
            where: { code: updateRequest.code }
        });
        if (isPartExist) {
            throw new ResponseError(404, "Code already exist");
        }

        // Validasi foreign key: rack_id
        const isRackExist = await prismaClient.rack.findUnique({
            where: { id: updateRequest.rack_id }
        });
        if (!isRackExist) {
            throw new ResponseError(404, "Rack not found");
        }

        // Validasi foreign key: machine_area_id
        const isMachineAreaExist = await prismaClient.machineArea.findUnique({
            where: { id: updateRequest.machine_area_id }
        });
        if (!isMachineAreaExist) {
            throw new ResponseError(404, "Machine Area not found");
        }

        // Validasi foreign key: machine_id
        const isMachineExist = await prismaClient.machine.findUnique({
            where: { id: updateRequest.machine_id }
        });
        if (!isMachineExist) {
            throw new ResponseError(404, "Machine not found");
        }

        const Kanban = await prismaClient.kanban.update({
            where: {
                id: id
            },
            data: updateRequest,
            include: {
                rack: true,
                machine_area: true,
                machine: true,
                supplier: true,
                maker: true
            }
        });

        return toKanbanResponse(Kanban);
    }


    static async get(request: SearchKanbanRequest): Promise<Pageable<KanbanResponse>> {

        const searchRequest = Validation.validate(KanbanValidation.SEARCH, request);

        const filters: any[] = [];

        if (searchRequest.keyword) {
            filters.push({
                OR: [
                    {
                        code: {
                            contains: searchRequest.keyword

                        }
                    },
                ]
            });
        }


        if (searchRequest.rack_id) {
            filters.push({
                rack_id: searchRequest.rack_id,
            });
        }


        if (searchRequest.machine_area_id) {
            filters.push({
                machine_area_id: searchRequest.machine_area_id,
            });
        }

        if (searchRequest.machine_id) {
            filters.push({
                machine_id: searchRequest.machine_id,
            });
        }

        const whereClause = filters.length > 0 ? { AND: filters } : {};

        // Default pagination values if not provided
        const page = searchRequest.page || 1;
        const limit = searchRequest.limit || 10;

        const skip = (page - 1) * limit;

        const [kanbans, total] = await Promise.all([
            prismaClient.kanban.findMany({
                where: whereClause,
                ...(searchRequest.paginate ? { take: limit, skip } : {}),
                include: {
                    rack: true,
                    machine_area: true,
                    machine: true,
                    supplier: true,
                    maker: true
                }
            }),
            prismaClient.kanban.count({
                where: whereClause,
            })
        ]);



        const pagination = searchRequest.paginate
            ? {
                curr_page: page,
                total_page: Math.ceil(total / limit),
                limit: limit,
                total: total
            }
            : undefined;


        return {
            data: kanbans.map(toKanbanResponse),
            ...(pagination ? { pagination } : {})

        };
    }

    static async show(identifier: number | string): Promise<KanbanResponse> {
        let kanban;

        if (typeof identifier === "number" || (!isNaN(Number(identifier)) && Number(identifier) > 0)) {
            kanban = await prismaClient.kanban.findUnique({
                where: {
                    id: Number(identifier),
                },
                include: {
                    rack: true,
                    machine_area: true,
                    machine: true,
                    supplier: true,
                    maker: true

                }
            });
        } else if (typeof identifier === "string") {
            kanban = await prismaClient.kanban.findUnique({
                where: {
                    code: identifier,
                },
                include: {
                    rack: true,
                    machine_area: true,
                    machine: true,
                    supplier: true,
                    maker: true

                }
            });
        } else {
            throw new ResponseError(400, "Invalid identifier");
        }

        if (!kanban) {
            throw new ResponseError(404, "Kanban not found");
        }

        return toKanbanResponse(kanban);
    }



    static async remove(id: number) {


        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const idISValid = await prismaClient.kanban.findUnique({
            where: {
                id: id
            }
        });

        if (!idISValid) {
            throw new ResponseError(404, "Kanban not found");
        }

        await prismaClient.kanban.delete({
            where: {
                id: id
            }
        });

    }


}


