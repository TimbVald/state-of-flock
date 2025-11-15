import { pgTable, uuid, varchar, text, timestamp, integer, date, pgEnum } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['Bishop', 'AssistingOverseer', 'AreaPastor', 'DataClerk'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  displayName: varchar('display_name', { length: 255 }),
  role: roleEnum('role').notNull(),
  createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
})

export const zones = pgTable('zones', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
})

export const userZones = pgTable('user_zones', {
  userId: uuid('user_id').notNull().references(() => users.id),
  zoneId: uuid('zone_id').notNull().references(() => zones.id),
})

export const members = pgTable('members', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  contact: varchar('contact', { length: 255 }),
  zoneId: uuid('zone_id').notNull().references(() => zones.id),
  status: varchar('status', { length: 50 }).default('active').notNull(),
  createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: false }).defaultNow().notNull(),
})

export const attendance = pgTable('attendance', {
  id: uuid('id').primaryKey(),
  zoneId: uuid('zone_id').notNull().references(() => zones.id),
  date: date('date').notNull(),
  presentCount: integer('present_count').default(0).notNull(),
  absentCount: integer('absent_count').default(0).notNull(),
})

export const followups = pgTable('followups', {
  id: uuid('id').primaryKey(),
  zoneId: uuid('zone_id').notNull().references(() => zones.id),
  memberId: uuid('member_id').notNull().references(() => members.id),
  date: timestamp('date', { withTimezone: false }).defaultNow().notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  notes: text('notes'),
  clerkUserId: uuid('clerk_user_id').references(() => users.id),
})