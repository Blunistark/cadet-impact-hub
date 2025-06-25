import { pgTable, text, serial, integer, boolean, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Create custom types
export const userRoleEnum = pgEnum('user_role', ['cadet', 'ano', 'co']);
export const problemStatusEnum = pgEnum('problem_status', ['pending', 'approved', 'rejected']);
export const problemPriorityEnum = pgEnum('problem_priority', ['low', 'medium', 'high']);
export const problemLevelEnum = pgEnum('problem_level', ['level1', 'level2', 'level3']);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: userRoleEnum("role").notNull().default('cadet'),
  unitCode: text("unit_code"),
  directorate: text("directorate"),
  wing: text("wing"),
  regimentalNumber: text("regimental_number"),
  rank: text("rank"),
  institute: text("institute"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const problems = pgTable("problems", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  tags: text("tags").array().default([]),
  status: problemStatusEnum("status").default('pending'),
  priority: problemPriorityEnum("priority").default('medium'),
  level: problemLevelEnum("level").default('level1'),
  postedBy: uuid("posted_by").references(() => profiles.id, { onDelete: 'cascade' }),
  approvedBy: uuid("approved_by").references(() => profiles.id, { onDelete: 'set null' }),
  approvalFeedback: text("approval_feedback"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profiles);
export const insertProblemSchema = createInsertSchema(problems);

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
export type Problem = typeof problems.$inferSelect;
export type InsertProblem = typeof problems.$inferInsert;

// Legacy schema for backward compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
