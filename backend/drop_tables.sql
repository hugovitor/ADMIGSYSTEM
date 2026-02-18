-- Script para limpar todas as tabelas do Supabase
-- Execute no SQL Editor do Supabase Dashboard

DROP TABLE IF EXISTS "__EFMigrationsHistory" CASCADE;
DROP TABLE IF EXISTS "ChildPresentations" CASCADE;
DROP TABLE IF EXISTS "FamilyMembers" CASCADE;
DROP TABLE IF EXISTS "JiuJitsuAttendances" CASCADE;
DROP TABLE IF EXISTS "JiuJitsuGraduations" CASCADE;
DROP TABLE IF EXISTS "JiuJitsuPayments" CASCADE;
DROP TABLE IF EXISTS "JiuJitsuStudents" CASCADE;
DROP TABLE IF EXISTS "Members" CASCADE;
DROP TABLE IF EXISTS "MensGroupMembers" CASCADE;
DROP TABLE IF EXISTS "MusicSchoolPreRegistrations" CASCADE;
DROP TABLE IF EXISTS "MusicSchoolStudents" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;
