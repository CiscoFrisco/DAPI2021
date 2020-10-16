-- DROPS

IF OBJECT_ID('CanLeadTo', 'U') IS NOT NULL
DROP TABLE CanLeadTo;
GO

IF OBJECT_ID('Develop', 'U') IS NOT NULL
DROP TABLE Develop;
GO

IF OBJECT_ID('IsCuredBy', 'U') IS NOT NULL
DROP TABLE IsCuredBy;
GO

IF OBJECT_ID('IsTreatedBy', 'U') IS NOT NULL
DROP TABLE IsTreatedBy;
GO

IF OBJECT_ID('BelongsTo', 'U') IS NOT NULL
DROP TABLE BelongsTo;
GO

IF OBJECT_ID('Disease', 'U') IS NOT NULL
 DROP TABLE Disease;
GO

IF OBJECT_ID('Cause', 'U') IS NOT NULL
 DROP TABLE Cause;
GO

IF OBJECT_ID('Speciality', 'U') IS NOT NULL
 DROP TABLE Speciality;
GO

IF OBJECT_ID('Treatment', 'U') IS NOT NULL
 DROP TABLE Treatment;
GO

IF OBJECT_ID('Symptom', 'U') IS NOT NULL
 DROP TABLE Symptom;
GO

IF OBJECT_ID('Drug', 'U') IS NOT NULL
 DROP TABLE Drug;
GO

-- TABLES

CREATE TABLE Disease
(
 Code nvarchar(12) NOT NULL PRIMARY KEY,
 Name nvarchar(160) NOT NULL,
 Description nvarchar(300) NOT NULL,
 Overview nvarchar(600) NOT NULL,
);
GO

CREATE TABLE Cause
(
 Code nvarchar(12) NOT NULL PRIMARY KEY,
 Name nvarchar(60) NOT NULL,
 Overview nvarchar(600) NOT NULL,
);
GO

CREATE TABLE Speciality
(
 Code nvarchar(12) NOT NULL PRIMARY KEY,
 Name nvarchar(50) NOT NULL,
 Overview nvarchar(600) NOT NULL,
);
GO

CREATE TABLE Treatment
(
 Code nvarchar(12) NOT NULL PRIMARY KEY,
 Name nvarchar(50) NOT NULL,
 Overview nvarchar(600) NOT NULL,
);
GO

CREATE TABLE Symptom
(
 Code nvarchar(12) NOT NULL PRIMARY KEY,
 Name nvarchar(70) NOT NULL,
 Overview nvarchar(600) NOT NULL,
);
GO

CREATE TABLE Drug
(
 Code nvarchar(12) NOT NULL PRIMARY KEY,
 Name nvarchar(120) NOT NULL,
 Overview nvarchar(600) NOT NULL,
);
GO

-- Associations

CREATE TABLE CanLeadTo
(
Code1 nvarchar(12) NOT NULL,
Code2 nvarchar(12) NOT NULL,
FOREIGN KEY (Code1) REFERENCES dbo.Disease(Code),
FOREIGN KEY (Code2) REFERENCES dbo.Cause(Code),
PRIMARY KEY (Code1, Code2),
);
GO

CREATE TABLE Develop
(
Code1 nvarchar(12) NOT NULL,
Code2 nvarchar(12) NOT NULL,
FOREIGN KEY (Code1) REFERENCES dbo.Disease(Code),
FOREIGN KEY (Code2) REFERENCES dbo.Symptom(Code),
PRIMARY KEY (Code1, Code2),
);
GO
 
CREATE TABLE IsCuredBy
(
Code1 nvarchar(12) NOT NULL,
Code2 nvarchar(12) NOT NULL,
FOREIGN KEY (Code1) REFERENCES dbo.Disease(Code),
FOREIGN KEY (Code2) REFERENCES dbo.Drug(Code),
PRIMARY KEY (Code1, Code2),
);
GO

CREATE TABLE IsTreatedBy
(
Code1 nvarchar(12) NOT NULL,
Code2 nvarchar(12) NOT NULL,
FOREIGN KEY (Code1) REFERENCES dbo.Disease(Code),
FOREIGN KEY (Code2) REFERENCES dbo.Treatment(Code),
PRIMARY KEY (Code1, Code2),
);
GO

CREATE TABLE BelongsTo
(
Code1 nvarchar(12) NOT NULL,
Code2 nvarchar(12) NOT NULL,
FOREIGN KEY (Code1) REFERENCES dbo.Disease(Code),
FOREIGN KEY (Code2) REFERENCES dbo.Speciality(Code),
PRIMARY KEY (Code1, Code2),
);
GO
