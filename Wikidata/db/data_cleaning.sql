DELETE FROM dbo.Disease WHERE code NOT IN
(select Code from dbo.Disease WHERE (Code in
(select Code1 FROM dbo.IsTreatedBy) AND Code in
(select Code1 from dbo.Develop)) OR (Code in
(select Code1 FROM dbo.IsTreatedBy) AND Code in
(select Code1 from dbo.IsCuredBy)) OR (Code in
(select Code1 FROM dbo.IsTreatedBy) AND Code in
(select Code1 from dbo.CanLeadTo)) OR (Code in
(select Code1 FROM dbo.IsTreatedBy) AND Code in
(select Code1 from dbo.BelongsTo)) OR (Code in
(select Code1 FROM dbo.Develop) AND Code in
(select Code1 from dbo.IsCuredBy)) OR (Code in
(select Code1 FROM dbo.Develop) AND Code in
(select Code1 from dbo.CanLeadTo)) OR (Code in
(select Code1 FROM dbo.Develop) AND Code in
(select Code1 from dbo.BelongsTo)) OR (Code in
(select Code1 FROM dbo.IsCuredBy) AND Code in
(select Code1 from dbo.CanLeadTo)) OR (Code in
(select Code1 FROM dbo.IsCuredBy) AND Code in
(select Code1 from dbo.BelongsTo)) OR (Code in
(select Code1 FROM dbo.CanLeadTo) AND Code in
(select Code1 from dbo.BelongsTo)));
GO

DELETE FROM dbo.Drug WHERE Code NOT IN
(select code2 FROM dbo.IsCuredBy);
GO

DELETE FROM dbo.Speciality WHERE Code NOT IN
(select code2 FROM dbo.BelongsTo);
GO

DELETE FROM dbo.Treatment WHERE Code NOT IN
(select code2 FROM dbo.IsTreatedBy);
GO

DELETE FROM dbo.Cause WHERE Code NOT IN
(select code2 FROM dbo.CanLeadTo);
GO

DELETE FROM dbo.Symptom WHERE Code NOT IN
(select code2 FROM dbo.Develop);
GO

UPDATE dbo.Disease
SET Name=UPPER(LEFT(Name,1))+SUBSTRING(Name,2,LEN(Name));
GO

UPDATE dbo.Speciality
SET Name=UPPER(LEFT(Name,1))+SUBSTRING(Name,2,LEN(Name));
GO

UPDATE dbo.Drug
SET Name=UPPER(LEFT(Name,1))+SUBSTRING(Name,2,LEN(Name));
GO

UPDATE dbo.Treatment
SET Name=UPPER(LEFT(Name,1))+SUBSTRING(Name,2,LEN(Name));
GO

UPDATE dbo.Cause
SET Name=UPPER(LEFT(Name,1))+SUBSTRING(Name,2,LEN(Name));
GO

UPDATE dbo.Symptom
SET Name=UPPER(LEFT(Name,1))+SUBSTRING(Name,2,LEN(Name));
GO