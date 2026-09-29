import {
    boolean,
    date,
    index,
    jsonb,
    numeric,
    pgTable,
    text,
    timestamp,
    unique,
    uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export const bank = pgTable("bank", {
    id: uuid("id").primaryKey(),

    code: text("code").notNull().unique(),

    nameTh: text("name_th").notNull(),

    nameEn: text("name_en").notNull(),

    logoUrl: text("logo_url"),

    country: text("country").notNull().default("TH"),

    isActive: boolean("is_active").notNull().default(true),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const financialAccount = pgTable(
    "financial_account",
    {
        id: uuid("id").primaryKey(),
        userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade", }),
        bankId: uuid("bank_id").notNull().references(() => bank.id),
        name: text("name").notNull(),
        customBankName: text("custom_bank_name"),
        accountNumberEncrypted: text("account_number_encrypted"),
        accountNumberLast4: text("account_number_last4"),
        accountType: text("account_type").notNull(),
        currency: text("currency").notNull().default("THB"),
        status: text("status").notNull().default("ACTIVE"),
        note: text("note"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
    },

    (table) => [
        index("financial_account_user_id_idx").on(table.userId),

        index("financial_account_bank_id_idx").on(table.bankId),
    ],
);

export const balanceHistory = pgTable(
    "balance_history",
    {
        id: uuid("id").primaryKey(),

        financialAccountId: uuid("financial_account_id")
            .notNull()
            .references(() => financialAccount.id, {
                onDelete: "cascade",
            }),

        balanceDate: date("balance_date").notNull(),

        balance: numeric("balance", {
            precision: 30,
            scale: 12,
        }).notNull(),

        note: text("note"),

        createdAt: timestamp("created_at").defaultNow().notNull(),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },

    (table) => [
        unique("balance_history_account_date_unique").on(
            table.financialAccountId,
            table.balanceDate,
        ),
    ],
);

export const auditLog = pgTable(
    "audit_log",
    {
        id: uuid("id").primaryKey(),

        userId: text("user_id")
            .notNull()
            .references(() => user.id, {
                onDelete: "cascade",
            }),

        entityType: text("entity_type").notNull(),

        entityId: uuid("entity_id").notNull(),

        action: text("action").notNull(),

        beforeData: jsonb("before_data"),

        afterData: jsonb("after_data"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
    },

    (table) => [
        index("audit_log_user_created_at_idx").on(
            table.userId,
            table.createdAt,
        ),

        index("audit_log_entity_idx").on(
            table.entityType,
            table.entityId,
        ),
    ],
);