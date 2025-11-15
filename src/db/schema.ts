import { pgTable, uuid, varchar, text, timestamp, integer, date, boolean, pgEnum } from 'drizzle-orm/pg-core'

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
  code: integer('code'),
  areaPastorId: uuid('area_pastor_id').references(() => users.id),
})

export const userZones = pgTable('user_zones', {
  userId: uuid('user_id').notNull().references(() => users.id),
  zoneId: uuid('zone_id').notNull().references(() => zones.id),
})

export const members = pgTable('members', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  primaryPhone: varchar('primary_phone', { length: 50 }).unique(),
  contact: varchar('contact', { length: 255 }),
  registrationStatus: varchar('registration_status', { length: 50 }),
  state: varchar('state', { length: 50 }),
  zoneId: uuid('zone_id').references(() => zones.id),
  bacentaId: uuid('bacenta_id'),
  leaderUserId: uuid('leader_user_id').references(() => users.id),
  status: varchar('status', { length: 50 }).default('active').notNull(),
  createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: false }).defaultNow().notNull(),
})

export const attendance = pgTable('attendance', {
  memberId: uuid('member_id').notNull().references(() => members.id),
  date: date('date').notNull(),
  present: boolean('present').default(true).notNull(),
  serviceType: varchar('service_type', { length: 50 }),
  markedById: uuid('marked_by_id').references(() => users.id),
}, (t) => ({
  pk: { columns: [t.memberId, t.date] },
}))

export const callLogs = pgTable('call_logs', {
  id: uuid('id').primaryKey(),
  memberId: uuid('member_id').notNull().references(() => members.id),
  callDate: timestamp('call_date', { withTimezone: false }).defaultNow().notNull(),
  result: varchar('result', { length: 50 }),
  callerId: uuid('caller_id').references(() => users.id),
  notes: text('notes'),
  nextFollowUpDate: date('next_follow_up_date'),
})

export const ministries = pgTable('ministries', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  leaderId: uuid('leader_id').references(() => users.id),
  zoneId: uuid('zone_id').references(() => zones.id),
})

export const bacentas = pgTable('bacentas', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  leaderId: uuid('leader_id').references(() => users.id),
  zoneId: uuid('zone_id').references(() => zones.id),
  ministryId: uuid('ministry_id').references(() => ministries.id),
})

export const syncSettings = pgTable('sync_settings', {
  id: uuid('id').primaryKey(),
  googleSheetId: varchar('google_sheet_id', { length: 255 }),
  syncFrequency: integer('sync_frequency'),
  lastSync: timestamp('last_sync', { withTimezone: false }),
})

export const systemConfig = pgTable('system_config', {
  id: uuid('id').primaryKey(),
  appName: varchar('app_name', { length: 255 }),
  branding: varchar('branding', { length: 255 }),
  primaryColor: varchar('primary_color', { length: 20 }),
})

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey(),
  actionType: varchar('action_type', { length: 100 }).notNull(),
  details: text('details'),
  userId: uuid('user_id').references(() => users.id),
  timestamp: timestamp('timestamp', { withTimezone: false }).defaultNow().notNull(),
})

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey(),
  type: varchar('type', { length: 100 }),
  title: varchar('title', { length: 255 }),
  recipientId: uuid('recipient_id').references(() => users.id),
  sentAt: timestamp('sent_at', { withTimezone: false }).defaultNow(),
})

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey(),
  type: varchar('type', { length: 100 }),
  title: varchar('title', { length: 255 }),
  generatedBy: uuid('generated_by').references(() => users.id),
  generatedAt: timestamp('generated_at', { withTimezone: false }).defaultNow(),
})