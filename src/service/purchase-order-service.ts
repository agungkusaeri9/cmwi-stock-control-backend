import xlsx from "xlsx";
import {
  PurchaseOrderResponse,
  CreatePurchaseOrderRequest,
  PurchaseOrderRawEntry,
  toPurchaseOrderResponse,
  SearchPurchaseOrderRequest,
} from "../model/purchase-order-model";
import {
  PurchaseOrderDetailRawEntry,
  CreatePurchaseOrderDetailRequest,
} from "../model/purchase-order-detail-model";
import { Validation } from "../validation/validation";
import { PurchaseOrderValidation } from "../validation/purchase-order-validation";
import { PurchaseOrderDetailValidation } from "../validation/purchase-order-detail-validation";
import { prismaClient } from "../application/database";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";
import { convertShortDate } from "../helper/convert-date-short-helper";

export class PurchaseOrderService {
  static async create(filePath: string) {
    const workbook: xlsx.WorkBook = xlsx.readFile(filePath);

    const sheet: xlsx.WorkSheet = workbook.Sheets["Sheet1"];

    const data: any[][] = xlsx.utils.sheet_to_json(sheet, {
      header: 1,
    });

    const headers: string[] = data[5] as string[];
    headers[10] = "Unit";

    const importantHeaders: string[] = [
      "No.",
      "Dept.",
      "Supplier",
      "PO No.",
      "PO Date",
      "SOB/PR Date",
    ];

    const missingHeaders: string[] = importantHeaders.filter(
      (h) => !headers.includes(h),
    );
    if (missingHeaders.length > 0) {
      logger.error(
        `Missing important headers in file ${filePath}: ${missingHeaders.join(
          ", ",
        )}`,
      );
      throw new Error(
        `Missing important headers in file ${filePath}: ${missingHeaders.join(
          ", ",
        )}`,
      );
    }

    const purchaseOrders: PurchaseOrderRawEntry[] = [];
    const purchaseOrderDetails: PurchaseOrderDetailRawEntry[] = [];

    for (let i = 6; i < data.length - 1; i++) {
      if (!data[i] || data[i].length === 0) continue;

      const purchaseOrderTemp: PurchaseOrderRawEntry = {};
      const purchaseOrderDetailTemp: PurchaseOrderDetailRawEntry = {};

      for (let j = 0; j < headers.length; j++) {
        purchaseOrderTemp[headers[j]] = data[i][j];
        purchaseOrderDetailTemp[headers[j]] = data[i][j];
      }

      const isDescriptionOnly: boolean =
        data[i].filter(
          (cell: any) => cell !== null && cell !== undefined && cell !== "",
        ).length === 1 && Boolean(purchaseOrderDetailTemp["Description"]);

      if (isDescriptionOnly && purchaseOrderDetails.length > 0) {
        purchaseOrderDetails[purchaseOrderDetails.length - 1]["Description"] +=
          ` ${purchaseOrderDetailTemp["Description"]}`;
        continue;
      }

      const hasPoHeader: boolean = Boolean(
        purchaseOrderTemp["PO No."] || purchaseOrderTemp["Supplier"],
      );

      if (hasPoHeader) {
        const poNo = purchaseOrderTemp["PO No."];
        const poAlreadyExist =
          poNo && purchaseOrders.some((po) => po["PO No."] === poNo);
        if (!poAlreadyExist) {
          purchaseOrders.push(purchaseOrderTemp);
        }
      }

      const hasPoDetail: boolean = Boolean(
        purchaseOrderDetailTemp["SOB/PR No."] ||
        purchaseOrderDetailTemp["Product Code"] ||
        purchaseOrderDetailTemp["Description"] ||
        purchaseOrderDetailTemp["Quantity"],
      );

      if (hasPoDetail) {
        if (!purchaseOrderDetailTemp["PO No."] && purchaseOrders.length > 0) {
          purchaseOrderDetailTemp["PO No."] =
            purchaseOrders[purchaseOrders.length - 1]["PO No."];
        }
        purchaseOrderDetails.push(purchaseOrderDetailTemp);
      }
    }

    for (const entry of purchaseOrderDetails) {
      if (entry["Description"]) {
        const parts = String(entry["Description"]).split(", ");
        if (parts.length > 1) {
          const [description, ...rest] = parts;
          entry["Description"] = description;
          entry["specification"] = rest.join(", ");
        }
      }

      if (entry["SOB/PR No."]) {
        const pr = String(entry["SOB/PR No."]).split("|");
        if (pr.length > 1) {
          const [prNumber, ...rest] = pr;
          entry["SOB/PR No."] = prNumber;
          entry["pr_requested"] = rest.join("|");
        }
      }
    }

    const parseNumber = (val: string | undefined): number | null =>
      val && val !== "-" ? Number(val) : null;

    const parseString = (val: string | undefined): string | null =>
      val && val !== "-" ? val.toString() : null;

    const parseDate = (val: string | undefined): Date | null =>
      val && val !== "-" ? convertShortDate(val) : null;

    const parseInteger = (val: string | undefined): number | null => {
      if (!val || val === "-") return null; // undefined, string kosong, atau tanda minus saja
      const n = parseInt(val, 10); // buang desimal
      return Number.isNaN(n) ? null : n; // NaN -> null
    };

    // ⬇️ NEW: Handle Supplier - Get/Create and map supplier_id
    const supplierNames = Array.from(
      new Set(
        purchaseOrders
          .map((entry) => parseString(entry.Supplier))
          .filter((s): s is string => !!s),
      ),
    );

    const existingSuppliers = await prismaClient.supplier.findMany({
      where: { name: { in: supplierNames } },
      select: { id: true, name: true },
    });

    const existingSupplierMap = new Map(
      existingSuppliers.map((s) => [s.name, s.id]),
    );

    const newSupplierNames = supplierNames.filter(
      (name) => !existingSupplierMap.has(name),
    );

    const newSuppliers = await prismaClient.$transaction(async (tx) => {
      return await tx.supplier
        .createMany({
          data: newSupplierNames.map((name) => ({ name })),
          skipDuplicates: true,
        })
        .then(() =>
          tx.supplier.findMany({
            where: { name: { in: newSupplierNames } },
            select: { id: true, name: true },
          }),
        );
    });

    newSuppliers.forEach((s) => existingSupplierMap.set(s.name, s.id));

    const purrchaseOrderFormattedResult: CreatePurchaseOrderRequest[] =
      purchaseOrders
        .map((entry) => {
          const supplierName = parseString(entry.Supplier);
          const supplier_id = supplierName
            ? existingSupplierMap.get(supplierName)
            : null;
          return {
            department: parseString(entry["Dept."]),
            supplier_id,
            po_number: parseString(entry["PO No."]),
            po_date: parseDate(entry["PO Date"]),
            pr_date: parseDate(entry["SOB/PR Date"]),
          };
        })
        .filter(
          (entry): entry is CreatePurchaseOrderRequest =>
            entry.po_number !== null && entry.supplier_id !== null,
        );

    const purrchaseOrderDetailFormattedResult: CreatePurchaseOrderDetailRequest[] =
      purchaseOrderDetails
        .map((entry) => ({
          po_number: parseString(entry["PO No."]),
          pr_number: parseString(entry["SOB/PR No."]),
          pr_requested: parseString(entry.pr_requested),
          kanban_code: parseString(entry["Product Code"]),
          description: parseString(entry.Description),
          specification: parseString(entry.specification),
          quantity: parseInteger(entry.Quantity),
          unit: parseString(entry.Unit),
          status: parseString(entry.Status),
          remark: parseString(entry.Remark),
        }))
        .filter(
          (entry): entry is CreatePurchaseOrderDetailRequest =>
            entry.po_number !== null,
        );

    try {
      const validatedRequest = Validation.validate(
        PurchaseOrderValidation.CREATE,
        purrchaseOrderFormattedResult,
      );
      const validatedDetailRequest = Validation.validate(
        PurchaseOrderDetailValidation.CREATE,
        purrchaseOrderDetailFormattedResult,
      );

      const prNumbers = validatedDetailRequest
        .map((po) => po.pr_number)
        .filter(Boolean) as string[];

      const existingPRs = await prismaClient.purchaseRequest.findMany({
        where: { pr_number: { in: prNumbers } },
        select: { pr_number: true },
      });

      const existingPRSet = new Set(existingPRs.map((e) => e.pr_number));
      const invalidPRNumbers = prNumbers.filter((pr) => !existingPRSet.has(pr));

      if (invalidPRNumbers.length > 0) {
        logger.error(
          `PR Numbers in file ${filePath} not found in DB: ${invalidPRNumbers.join(
            ", ",
          )}`,
        );
      }

      let filteredDetailRequest = validatedDetailRequest.filter(
        (detail) =>
          detail.pr_number && !invalidPRNumbers.includes(detail.pr_number),
      );

      const kanbanData = filteredDetailRequest.filter(
        (item): item is { kanban_code: string } & typeof item =>
          typeof item.kanban_code === "string" &&
          item.kanban_code.trim() !== "",
      );

      const kanbanCodes = kanbanData.map((item) => item.kanban_code);

      const existingKanban = await prismaClient.kanban.findMany({
        where: { code: { in: kanbanCodes } },
        select: { code: true },
      });

      const existingKanbanCodes = new Set(existingKanban.map((e) => e.code));

      // Filter kanban yang belum ada di DB
      const missingKanban = kanbanData.filter(
        (item) => !existingKanbanCodes.has(item.kanban_code),
      );

      if (missingKanban.length > 0) {
        logger.error(
          `Some kanban codes in file ${filePath} do not exist in database: ${missingKanban
            .map((m) => m.kanban_code)
            .join(", ")}`,
        );

        // Simpan ke tabel kanban_stagging dengan cek duplikasi terlebih dahulu
        const missingCodes = missingKanban.map((item) => item.kanban_code);

        const existingStaggings = await prismaClient.kanbanStagging.findMany({
          where: { kanban_code: { in: missingCodes } },
          select: { kanban_code: true },
        });
        const existingCodesSet = new Set(
          existingStaggings.map((e) => e.kanban_code),
        );

        // Kelompokkan quantity untuk kanban_code yang sudah ada agar increment sekali per kode
        const toUpdateMap = missingKanban.reduce((map, item) => {
          const code = item.kanban_code!;
          if (!existingCodesSet.has(code)) return map;
          const qty = item.status === "On Order" ? item.quantity || 0 : 0;
          map.set(code, (map.get(code) || 0) + qty);
          return map;
        }, new Map<string, number>());

        // Increment incoming_order_stock untuk yang sudah ada
        if (toUpdateMap.size > 0) {
          await Promise.all(
            Array.from(toUpdateMap.entries()).map(([code, qty]) =>
              prismaClient.kanbanStagging.updateMany({
                where: { kanban_code: code },
                data: {
                  incoming_order_stock: { increment: qty },
                },
              }),
            ),
          );
        }

        // Buat baru untuk yang belum ada
        const toCreate = missingKanban.filter(
          (item) => !existingCodesSet.has(item.kanban_code!),
        );
        if (toCreate.length > 0) {
          await prismaClient.kanbanStagging.createMany({
            data: toCreate.map((item) => ({
              kanban_code: item.kanban_code!,
              description: item.description,
              incoming_order_stock:
                item.status === "On Order" ? item.quantity || 0 : 0,
            })),
          });
        }

        const missingKanbanPoCodes = missingKanban
          .filter((item) => item.po_number)
          .map((item) => item.po_number!);

        const missingKanbanPoCodesSet = new Set(missingKanbanPoCodes);

        const missingOrderRequest = validatedRequest.filter((item) => {
          const poNumber = item.po_number;
          return poNumber && missingKanbanPoCodesSet.has(poNumber);
        });

        await Promise.all(
          missingOrderRequest.map((item) => {
            return prismaClient.purchaseOrderStagging.upsert({
              where: {
                po_number: item.po_number,
              },
              update: {
                department: item.department,
                supplier_id: item.supplier_id,
                po_date: item.po_date,
                pr_date: item.pr_date,
              },
              create: {
                po_number: item.po_number,
                department: item.department,
                supplier_id: item.supplier_id,
                po_date: item.po_date,
                pr_date: item.pr_date,
              },
            });
          }),
        );

        await prismaClient.purchaseOrderDetailStagging.deleteMany({
          where: {
            po_number: { in: missingKanbanPoCodes },
          },
        });

        await prismaClient.purchaseOrderDetailStagging.createMany({
          data: missingKanban.map((item) => ({
            kanban_code: item.kanban_code,
            po_number: item.po_number,
            pr_number: item.pr_number,
            pr_requested: item.pr_requested,
            description: item.description,
            specification: item.specification,
            quantity: item.quantity,
            unit: item.unit,
            remark: item.remark,
            status: item.status,
          })),
        });

        // Join missingKanban dengan header PO dan simpan ke purchase_order_stagging
        // const headerByPONumber = new Map(
        //   validatedRequest.map((po) => [po.po_number, po])
        // );

        // await prismaClient.purchaseOrderStagging.deleteMany({
        //   where: {
        //     kanban_code: { in: missingCodes },
        //   },
        // });

        // const poStaggingData = missingKanban.reduce((acc, item) => {
        //   const header = headerByPONumber.get(item.po_number!);
        //   if (!header) return acc;

        //   const data: any = {
        //     supplier_id: header.supplier_id!,
        //     po_number: header.po_number,
        //     kanban_code: item.kanban_code!,
        //   };

        //   if (header.department !== null && header.department !== undefined) {
        //     data.department = header.department;
        //   }
        //   if (header.po_date) {
        //     data.po_date = header.po_date;
        //   }
        //   if (header.pr_date) {
        //     data.pr_date = header.pr_date;
        //   }
        //   if (item.pr_number) {
        //     data.pr_number = item.pr_number;
        //   }
        //   if (item.pr_requested) {
        //     data.pr_requested = item.pr_requested;
        //   }
        //   if (item.description) {
        //     data.description = item.description;
        //   }
        //   if (item.specification) {
        //     data.specification = item.specification;
        //   }
        //   if (typeof item.quantity === "number") {
        //     data.quantity = item.quantity;
        //   }
        //   if (item.unit) {
        //     data.unit = item.unit;
        //   }
        //   if (item.remark) {
        //     data.remark = item.remark;
        //   }
        //   if (item.status) {
        //     data.status = item.status;
        //   }

        //   acc.push(data);
        //   return acc;
        // }, [] as any[]);

        // if (poStaggingData.length > 0) {
        //   await prismaClient.purchaseOrderStagging.createMany({
        //     data: poStaggingData,
        //   });
        // }
      }

      filteredDetailRequest = filteredDetailRequest.filter(
        (item) =>
          !item.kanban_code || existingKanbanCodes.has(item.kanban_code),
      );

      const validPONumbers = new Set(
        filteredDetailRequest.map((e) => e.po_number),
      );
      const validPrNumbers = Array.from(
        new Set(
          filteredDetailRequest
            .map((e) => e.pr_number)
            .filter((pr): pr is string => pr !== null),
        ),
      );
      const filteredRequest = validatedRequest.filter((po) =>
        validPONumbers.has(po.po_number),
      );

      const incomingPONumbers = Array.from(validPONumbers);

      const existingPOs = await prismaClient.purchaseOrder.findMany({
        where: { po_number: { in: incomingPONumbers } },
        select: { po_number: true },
      });

      const existingPONumbers = existingPOs.map((e) => e.po_number);
      if (existingPONumbers.length > 0) {
        logger.error(
          `Duplicate PO Numbers in file ${filePath} found in DB (will be replaced): ${existingPONumbers.join(
            ", ",
          )}`,
        );
      }

      await prismaClient.$transaction(async (tx) => {
        // Ambil semua PO Detail yang akan dinonaktifkan
        const poDetailsToDelete = await tx.purchaseOrderDetail.findMany({
          where: {
            po_number: { notIn: incomingPONumbers },
            is_active: true,
          },
          select: {
            pr_number: true,
          },
        });

        // Ambil daftar unik PR number
        const deletedPrNumbers = Array.from(
          new Set(
            poDetailsToDelete
              .map((e) => e.pr_number)
              .filter((pr): pr is string => pr !== null),
          ),
        );

        // Update PO Detail menjadi tidak aktif
        await tx.purchaseOrderDetail.updateMany({
          where: {
            po_number: { notIn: incomingPONumbers },
            is_active: true,
          },
          data: { is_active: false },
        });

        // Update PR Detail yang terkait menjadi tidak aktif
        await tx.purchaseRequestDetail.updateMany({
          where: {
            pr_number: { in: deletedPrNumbers },
            is_active: true,
          },
          data: { is_active: false },
        });

        if (filteredRequest.length > 0) {
          await tx.purchaseOrder.createMany({
            data: filteredRequest,
            skipDuplicates: true,
          });
        }

        if (filteredDetailRequest.length > 0) {
          // Ambil existing PO Detail berdasarkan existingPONumbers
          const existingpurchaseOrderDetail =
            await prismaClient.purchaseOrderDetail.findMany({
              where: {
                po_number: { in: existingPONumbers },
              },
              select: {
                id: true,
                po_number: true,
                kanban_code: true,
                pr_number: true,
              },
            });

          // Buat Set dari kombinasi po_number + kanban_code dari data baru (filtered)
          const filteredDetailSet = new Set(
            filteredDetailRequest.map(
              (d) => `${d.po_number}::${d.kanban_code}`,
            ),
          );

          // Cari PO Detail yang tidak ada di filteredDetailRequest
          // Ambil existing PO Detail …  (potongan kode awal tetap)

          const notInFiltered = existingpurchaseOrderDetail.filter(
            (existing) => {
              const key = `${existing.po_number}::${existing.kanban_code}`;
              return !filteredDetailSet.has(key);
            },
          );

          // Ambil ID‑ID yang harus di‑non‑aktifkan
          const idsToDeactivate = notInFiltered.map((d) => d.id);

          if (idsToDeactivate.length > 0) {
            await tx.purchaseOrderDetail.updateMany({
              where: { id: { in: idsToDeactivate } },
              data: { is_active: false },
            });
          }

          const pairsToDeactivate = notInFiltered
            // filter yang memastikan hanya data dengan pr_number dan kanban_code yang tidak null
            .filter(
              (d): d is typeof d & { pr_number: string; kanban_code: string } =>
                d.pr_number !== null && d.kanban_code !== null,
            )
            // petakan menjadi pasangan kondisi
            .map((d) => ({
              pr_number: d.pr_number,
              kanban_code: d.kanban_code,
            }))
            // hapus duplikat (opsional tapi aman)
            .filter(
              (v, i, arr) =>
                arr.findIndex(
                  (p) =>
                    p.pr_number === v.pr_number &&
                    p.kanban_code === v.kanban_code,
                ) === i,
            );

          if (pairsToDeactivate.length > 0) {
            await tx.purchaseRequestDetail.updateMany({
              where: { OR: pairsToDeactivate },
              data: { is_active: false },
            });
          }

          // Hapus hanya PO Detail yang tidak termasuk dan tidak mengandung kanban_code yang dinonaktifkan
          const detailToDelete = existingpurchaseOrderDetail.filter(
            (existing) => {
              const key = `${existing.po_number}::${existing.kanban_code}`;
              return filteredDetailSet.has(key);
            },
          );

          if (detailToDelete.length > 0) {
            const idsToDelete = detailToDelete.map((d) => d.id);

            await tx.purchaseOrderDetail.deleteMany({
              where: {
                id: { in: idsToDelete },
              },
            });
          }

          // Buat ulang detail baru
          await tx.purchaseOrderDetail.createMany({
            data: filteredDetailRequest,
          });
        }

        const kanbanPoPairs = filteredDetailRequest
          .filter((item) => item.kanban_code && item.po_number)
          .map((item) => ({
            kanban_code: item.kanban_code!,
            po_number: item.po_number!,
          }));

        const lastOrderStock = await prismaClient.stockOrderKanban.findMany({
          where: {
            OR: kanbanPoPairs,
          },
        });

        const kanbanGroup = Object.values(
          filteredDetailRequest.reduce(
            (acc, curr) => {
              if (!curr.kanban_code || !curr.po_number) return acc;

              const key = `${curr.kanban_code}-${curr.po_number}`;

              if (!acc[key]) {
                acc[key] = {
                  kanban_code: curr.kanban_code,
                  po_number: curr.po_number,
                  quantity: 0,
                };
              }
              if (curr.status === "On Order") {
                acc[key].quantity += curr.quantity || 0;
              }
              return acc;
            },
            {} as Record<
              string,
              { kanban_code: string; po_number: string; quantity: number }
            >,
          ),
        );

        const updatedKanbanGroup = kanbanGroup.map((item) => {
          const lastStock = lastOrderStock.find(
            (e) =>
              e.kanban_code === item.kanban_code &&
              e.po_number === item.po_number,
          );
          if (lastStock) {
            item.quantity -= lastStock.last_stock;
          }
          return item;
        });

        const validKanbanGroup = updatedKanbanGroup.filter(
          (item) => item.quantity > 0,
        );

        await Promise.all(
          validKanbanGroup.map((item) =>
            tx.kanban.update({
              where: {
                code: item.kanban_code,
              },
              data: {
                incoming_order_stock: {
                  increment: item.quantity,
                },
              },
            }),
          ),
        );

        await Promise.all(
          validKanbanGroup.map((item) => {
            return tx.stockOrderKanban.upsert({
              where: {
                kanban_code_po_number: {
                  kanban_code: item.kanban_code,
                  po_number: item.po_number,
                },
              },
              update: {
                last_stock: {
                  increment: item.quantity,
                },
              },
              create: {
                kanban_code: item.kanban_code,
                po_number: item.po_number,
                last_stock: item.quantity,
              },
            });
          }),
        );

        // Ambil pasangan product_code dan supplier_id dari detail PO
        const productSupplierPairs = filteredDetailRequest
          .map((detail) => {
            const product_code = detail.kanban_code;
            const po = filteredRequest.find(
              (po) => po.po_number === detail.po_number,
            );
            if (!po || !product_code || !po.supplier_id) return null;
            return { product_code, supplier_id: po.supplier_id };
          })
          .filter(
            (entry): entry is { product_code: string; supplier_id: number } =>
              !!entry,
          );

        // Ambil ID kanban berdasarkan code
        const uniqueProductCodes = Array.from(
          new Set(productSupplierPairs.map((e) => e.product_code)),
        );
        const kanbans = await tx.kanban.findMany({
          where: { code: { in: uniqueProductCodes } },
          select: { id: true, code: true },
        });

        const kanbanMap = new Map(kanbans.map((k) => [k.code, k.id]));

        // Buat relasi kanban_id dan supplier_id
        const relationData = productSupplierPairs
          .map(({ product_code, supplier_id }) => {
            const kanban_id = kanbanMap.get(product_code);
            return kanban_id ? { kanban_id, supplier_id } : null;
          })
          .filter((r): r is { kanban_id: number; supplier_id: number } => !!r);

        // Hapus duplikat
        const uniqueRelations = Array.from(
          new Set(relationData.map((r) => `${r.kanban_id}-${r.supplier_id}`)),
        ).map((key) => {
          const [kanban_id, supplier_id] = key.split("-").map(Number);
          return { kanban_id, supplier_id };
        });

        // Simpan ke tabel pivot (_KanbanToSupplier)
        for (const { kanban_id, supplier_id } of uniqueRelations) {
          await tx.kanban.update({
            where: { id: kanban_id },
            data: {
              supplier: {
                connect: { id: supplier_id },
              },
            },
          });
        }
      });

      logger.info("Purchase order and details created successfully.");
      return true;
    } catch (error) {
      logger.error(
        `Error while creating PO and details: ${
          error instanceof Error ? error.stack : JSON.stringify(error)
        }`,
      );
      throw error;
    }
  }

  static async get(
    request: SearchPurchaseOrderRequest,
  ): Promise<Pageable<PurchaseOrderResponse>> {
    const searchRequest = Validation.validate(
      PurchaseOrderValidation.SEARCH,
      request,
    );

    const filters: any[] = [];

    if (searchRequest.keyword) {
      const keyword = searchRequest.keyword.replace(/\\/g, "\\\\");
      filters.push({
        OR: [
          { po_number: { contains: keyword } },
          {
            purchase_order_detail: {
              some: {
                kanban_code: { contains: keyword },
              },
            },
          },
        ],
      });
    }

    if (searchRequest.start_date) {
      filters.push({
        po_date: {
          gte: searchRequest.start_date,
        },
      });
    }

    if (searchRequest.end_date) {
      filters.push({
        po_date: {
          lte: searchRequest.end_date,
        },
      });
    }

    const whereClause = filters.length > 0 ? { AND: filters } : {};

    // Default pagination values if not provided
    const page = searchRequest.page || 1;
    const limit = searchRequest.limit || 10;

    const skip = (page - 1) * limit;

    const [purchaseOrderss, total] = await Promise.all([
      prismaClient.purchaseOrder.findMany({
        where: whereClause,
        orderBy: {
          created_at: "desc",
        },
        ...(searchRequest.paginate ? { take: limit, skip } : {}),
        include: {
          supplier: true,
        },
      }),
      prismaClient.purchaseOrder.count({
        where: whereClause,
      }),
    ]);

    const pagination = searchRequest.paginate
      ? {
          curr_page: page,
          total_page: Math.ceil(total / limit),
          limit: limit,
          total: total,
        }
      : undefined;

    return {
      data: purchaseOrderss.map(toPurchaseOrderResponse),
      ...(pagination ? { pagination } : {}),
    };
  }

  static async show(id: number): Promise<PurchaseOrderResponse> {
    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid id");
    }

    const PurchaseOrder = await prismaClient.purchaseOrder.findUnique({
      where: { id: id },
      include: {
        purchase_order_detail: true,
        supplier: true,
      },
    });

    if (!PurchaseOrder) {
      throw new ResponseError(404, "PurchaseOrder not found");
    }

    const detailMapped = PurchaseOrder.purchase_order_detail.map((detail) => {
      return {
        ...detail,
        status: detail.is_active ? detail.status : "Closed",
      };
    });

    PurchaseOrder.purchase_order_detail = detailMapped;

    return toPurchaseOrderResponse(PurchaseOrder);
  }
}
