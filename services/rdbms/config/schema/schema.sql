drop database if exists odyssey;
create database odyssey;

use odyssey;

-- an ancillary table supporting the application organisation requirements.

create table organisation (
    id int not null auto_increment,
    name varchar(32) not null unique,
    abbreviation varchar(4) not null unique, -- a three char abbreviation
    assetRole varchar(16), -- owner, maintainer, supplier

    created timestamp not null default now(), -- when was this record created
    updated timestamp not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id),
    fulltext key text (name, abbreviation, assetRole),
    constraint ck_organisation_assetRole check (assetRole in ('owner', 'maintainer', 'supplier'))
);

-- an ancillary table supporting assets with location categories.
create table assetLocationCategory (
    id int not null auto_increment, -- the primary key
    name varchar(32) not null unique, -- segregated, street running, pedestrian zone, red zone
    description varchar(256) not null,

    created timestamp not null default now(), -- when was this record created
    updated timestamp not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id),
    fulltext key text (name, description)
);

-- an asset is a physical space allocated to provide functionality that satisfies some requirement
create table asset (
    id int not null auto_increment, -- the primary key

    assetRef int null, -- reference to a perent child relationship, null would indicate the asset at the top of the hierarchy
    locationCategoryRef int null, -- reference to the location category table
    
    ownedByRef int null, -- the organisation who ownes this asset reference to the organisation table
    maintainedByRef int null, -- the organisation who maintains this asset reference to the organisation table
    -- locationCategoryRef varchar(64) null, -- what type of access is required Red Zone, Segregated, Street Running

    name varchar(32) not null unique, -- the name describing the asset is unique
    description varchar(256) not null, -- a short functional description or contract requirement

    locationType varchar(8) null, -- type area or type point
    location json null, -- the location json value for the map interface
    locationDescription varchar(256) null, -- a brief description of the location

    status varchar(64) not null default 'design', -- valid options are Design, procure, Install, commissioned, decommissioned, disposed
    installedDate date null, -- the date the asset was installed
    commissionedDate date null, -- the date the asset was commissioned
    decommissionedDate date null, -- the date the asset was decommissioned
    disposedDate date null, -- the date the assert was disposed

    created timestamp not null default now(), -- when was this record created
    updated timestamp not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed
    
    primary key (id),
    fulltext key text (name, description, status),
    constraint fk_asset_assetRef foreign key (assetRef) references asset (id) on update cascade on delete cascade,
    constraint fk_asset_assetLocationCategoryRef foreign key (locationCategoryRef) references assetLocationCategory (id) on update cascade on delete cascade,
    constraint fk_asset_owedByRef foreign key (ownedByRef) references organisation (id) on update cascade on delete cascade,
    constraint fk_asset_maintainedByRef foreign key (maintainedByRef) references organisation (id) on update cascade on delete cascade,
    constraint ck_asset_status check (status in ('design', 'procure', 'installed', 'commissioned', 'decommissioned', 'disposed')),
    constraint ck_asset_locationType check (locationType in ('area', 'point'))
);

-- the specific equioment model details
create table equipmentModel (
    id int not null auto_increment,

    manufacturerRef varchar(64) not null, -- the organisational reference for the manufacturer this reference the organisation service

    partNumber varchar(64) null,
    website varchar(256) null,
    expectedLifeWeeks smallInt not null, -- how many months will this equipment last
    mtbfHours int not null, -- what is the mean time (hours) between failures
    mtbrHours int not null, -- what is the mean time (hours) between repairs

    created datetime not null default now(), -- when was this record created
    updated datetime not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id)
);

-- equipment is allocated to an asset; there can be many equipment to a single asset
create table equipment (
    id int not null auto_increment,

    assetRef int not null, -- a reference to the asset
    parentEquipmentRef int null, -- parent child recursive relationships or equipment hirarchy
    equipmentModelRef int not null, -- the reference to the equipment model details

    name varchar(32) not null, -- what is this equipment is known as
    serialNumber varchar(256) not null, -- the actual serial number for this item
    purchaseDate date not null, -- the date the order was placed
    deliveredDate date null, -- the date the order was delivered
    installed datetime not null, -- the date the equioment was installed
    commissioned datetime not null, -- the date the equipment was commissioned
    decommissioned datetime null, -- the date the equioment was decommissioned
    uninstalled datetime null, -- the date the equioment was installed
    disposed date null,  -- the date the equipment was disposed of

    created datetime not null default now(), -- when was this record created
    updated datetime not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id),
    constraint fk_equipment_assetRef foreign key (assetRef) references asset (id) on update cascade on delete cascade,
    constraint fk_equipment_parentEquipmentref foreign key (parentEquipmentRef) references equipment (id) on update cascade on delete cascade,
    constraint fk_equipment_equipmentModelRef foreign key (equipmentModelRef) references equipmentModel (id) on update cascade on delete cascade
);

-- the temporary acceptance of non compliance details
create table equipmentTanc (
    id int not null auto_increment,

    equipmentRef int not null, -- reference to the equipment
    tancRef varchar(64) not null, -- reference to the tanc Service

    created datetime not null default now(), -- when was this record created
    updated datetime not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id),
    constraint fk_equipmentTanc_equipmentRef foreign key (equipmentRef) references equipment (id) on update cascade on delete cascade
);

-- VALIDATION --
-- requirement source table, this could make reference to the Law, Contract, Best Practice, and the Manufacturers O&M
create table requirementSource (
    id int not null auto_increment, -- the primary key

    source varchar(32) not null, -- the short description of the requirement source
    description varchar(256) not null, -- the long description of the requirement source
    reference varchar(64) not null, -- the documented reference number of the source
    version varchar(32) not null, -- the version of the source document
    url varchar(256) null, -- a web reference to the source
    reviewedDate date not null, -- a date indicating when the source was reviewed
    reviewPeriodWeeks tinyint not null, -- the period between review dates

    created datetime not null default now(), -- when was this record created
    updated datetime not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id)
);

-- what are the requirements that need to be satisfied
create table requirement (
    id int not null auto_increment, -- the primary key

    requirementSourceRef int not null, -- the referecne to the requirement source table

    title varchar(32) not null unique, -- the requirements title
    requirement varchar(512) not null, -- a description of the requirement
    guidance varchar(512) null, -- ny guidance on how the requirements could be satified
    
    reviewedDate date not null, -- a date indicating when the source was reviewed
    reviewPeriodWeeks tinyint not null, -- the period between review dates
    expires date null, -- a date in the future when this requirement will no longer be required

    created datetime not null default now(), -- when was this record created
    updated datetime not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id),
    constraint fk_requirement_requirementSourceRef foreign key (requirementSourceRef) references requirementSource (id) on update cascade on delete cascade
);

-- specify how the requirements will be satisfied through a task specification
create table taskSpecification (
    id int not null auto_increment, -- the primary key

    requirementRef int not null, -- the reference to the requirement table

    title varchar(32) not null unique, -- the specification title
    specification varchar(256) not null, -- the specification text - shall, will, must

    reviewedDate date not null, -- a date indicating when the specification was reviewed
    reviewPeriodWeeks tinyint not null, -- the period between review dates
    expires date null, -- a date in the future when this specification will no longer be required

    taskScheduleType varchar(32) not null, -- two types cyclical or Week based

    taskCyclicalStartDate date null, -- the date the task must start
    taskCyclicalFrequencyWeeks tinyInt null, -- the task periodicity in weeks
    -- or
    taskIsoDateStartWeek tinyInt not null, -- 52/53 weeks in a year
    taskIsoDateDay tinyInt not null, -- 7 days in a week - 1 = Monday
    taskIsoDateRepeatType varchar(32) null, -- task period repeats [weekly, daily] must be divisable by 52, 26, 13 or 1, 4, 12, 24, 48
    taskIsoDateRepeats tinyInt null, -- frequency at which the task repeats

    taskTolerenceType varchar(32) not null, --  weeks, days
    tolerance tinyInt not null, -- the value by which the task can be brought forward or taken back

    created datetime not null default now(), -- when was this record created
    updated datetime not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id),
    constraint fk_taskSpecification_requirementRef foreign key (requirementRef) references requirement (id) on update cascade on delete cascade,
    constraint ck_taskSpecification_taskScheduleType check (taskScheduleType in ('cyclical', 'period'))
);

-- a list of sequencial instruction to satisfy the specification
create table taskRequirement (
    id int not null auto_increment, -- the primary key

    taskSpecificationRef int not null, -- the reference to the task specification table

    title varchar(32) not null, -- the instructions task
    description varchar(256) not null, -- the instructions description
    durationHours tinyInt not null, -- how long the task will take
    resource tinyInt not null, -- how many people are required to complete task
    sequence smallInt not null, -- the 

    -- future link to competency
    -- future link to tools
    -- future link to plant
    -- future link to parts/consumables

    created datetime not null default now(), -- when was this record created
    updated datetime not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id),
    constraint fk_taskInstruction_taskSpecificationRef foreign key (taskSpecificationRef) references taskSpecification (id) on update cascade on delete cascade

);

create table taskInstruction (
    id int not null auto_increment, -- the primary key

    taskRequirementRef int not null, -- a reference to the task requirement table

    sequence smallInt not null, -- the key to ordering this list for presentation
    instruction varchar(512) not null, -- detail to complete the step

    created datetime not null default now(), -- when was this record created
    updated datetime not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id),
    constraint fk_taskInstruction_taskRequirementRef foreign key (taskRequirementRef) references taskRequirement (id) on update cascade on delete cascade
);

create table taskRecordRequirement (
    id int not null auto_increment, -- the primary key

    taskInstructionRef int not null, -- the reference to the task instruction table

    item varchar(32) not null, -- the name of the item to be recorded
    dataType varchar(32) not null, -- what kind of data needs to be recorded - numerical, boolean, signature, photo, text, pdf document

    created datetime not null default now(), -- when was this record created
    updated datetime not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id),
    constraint fk_taskRecord_taskInstructionRef foreign key (taskInstructionRef) references taskInstruction (id) on update cascade on delete cascade
);

-- *************************
-- Fatigue monitoring tables
-- *************************

create table fatigueIndex (
    id int not null auto_increment,

    userRef varchar(64) not null,

    -- fategue score how is this going to work

    created timestamp not null default now(), -- when was this record created
    updated timestamp not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed
    
    primary key (id)
);

-- a list or plan showing turns of duty or leave for individuals or groups in an organization.
create table roster ( 
    id int not null auto_increment,

    name varchar(64) not null, -- the roster name typically associated with the department it's covering
    description varchar(64) not null, -- the roster description

    created timestamp not null default now(), -- when was this record created
    updated timestamp not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id)
);

create table team (
    id int not null auto_increment,

    departmentRef varchar(64) not null, -- external api reference

    name varchar(64) not null, -- the team's name
    description varchar(256) not null, -- the team's description

    created timestamp not null default now(), -- when was this record created
    updated timestamp not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id)
);

create table teamAllocation (
    id int not null auto_increment,

    teamRef int not null, -- internal team reference
    personRef varchar(64) not null, -- external api reference

    created timestamp not null default now(), -- when was this record created
    updated timestamp not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id),
    constraint fk_teamAllocation_teamRef foreign key (teamRef) references team (id) on update cascade on delete cascade
);

-- A shift is a formal schedule that determines the work hours of a shift-based employee team
-- many duties make up one
create table shift ( 
    id int not null auto_increment, -- the primary key

    rosterRef int not null, -- reference to the roster table

    name varchar(64) not null,
    description varchar(512) not null,

    effectiveDate date not null, -- this is the day the shift comences

    shiftStartDay tinyint not null, -- what day of the week does the shift start
    startTime time not null, -- what is the start time of this shift
    durationMinutes smallint not null, -- how many minutes will this shift last
    intervalMinutes smallint not null, -- how many minutes between shift end and shift start
    repeats tinyint not null, -- how many times does the shift repeat (starts Monday repeats 4 times to Friday)

    requiredPeople tinyint not null, -- how many people should be alocated to this shift

    created timestamp not null default now(), -- when was this record created
    updated timestamp not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id),
    constraint fk_shift_rosterRef foreign key (rosterRef) references roster (id) on update cascade on delete cascade
);

create table shiftPattern (
    id int not null auto_increment, -- the primary key

    teamRef int not null, -- the foreign key reference to the team table

    name varchar(64) not null,
    description varchar(512) not null,

    created timestamp not null default now(), -- when was this record created
    updated timestamp not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id),
    constraint fk_shiftPattern_teamRef foreign key (teamRef) references team (id) on update cascade on delete cascade
);

create table shiftSequence ( -- how shifts follow on from each other
    id int not null auto_increment, -- the primary key

    shiftPatternRef int not null, -- the reference to the shift pattern table
    shiftRef int not null, -- the reference to the shift table
    shiftSequenceOrder tinyint not null, -- the shift sequence order

    created timestamp not null default now(), -- when was this record created
    updated timestamp not null default now() on update now(), -- when was the last time this record was updated
    inuse boolean not null default true, -- can this record be used / viewed

    primary key (id),
    constraint fk_shiftSequence_shiftPatternRef foreign key (shiftPatternRef) references shiftPattern (id) on update cascade on delete cascade
);

delimiter //
-- ***********************
-- Asset Stored Procedures
-- ***********************
create procedure sp_selectAssets (in searchText varchar(64))
    begin
        if(searchText <> '') then
            select a.id, b.name as owner, b.abbreviation as ownerAbbr, c.name as maintainer, c.abbreviation as maintainerAbbr, a.name, a.status from asset a
                left outer join organisation b on a.ownedByRef = b.id
                left outer join organisation c on a.maintainedByRef = c.id
            where a.inuse = 1
            and match(a.name, a.description, a.status) against(searchText in boolean mode)
            order by a.name;
        else
            select  a.id, b.name as owner, b.abbreviation as ownerAbbr, c.name as maintainer, c.abbreviation as maintainerAbbr, a.name, a.status from asset a
                left outer join organisation b on a.ownedByRef = b.id
                left outer join organisation c on a.maintainedByRef = c.id
            where a.inuse = 1
            and a.assetRef is null
            order by a.name;
        end if;
    end//

create procedure sp_selectContainedAssets (in uid int)
    begin
        select id, name, status, locationType  from asset 
        where inuse = 1
        and assetRef = uid
        order by name;
    end//

create procedure sp_insertAsset (in assetRef int, ownedByRef int, maintainedByRef int, name varchar(32), description varchar(256), out insertId int)
    begin
        insert into asset (assetRef, ownedByRef, maintainedByRef, name, description)
        values (assetRef, ownedByRef, maintainedByRef, name, description);

        set insertId := last_insert_id();
        select insertId;
    end//

create procedure sp_selectAsset (in uid int)
    begin
        select 
        a.id, b.name as parent, b.id as parentId, a.ownedByRef, a.maintainedByRef, a.locationCategoryRef, a.name, a.description, a.locationType, a.location, a.locationDescription, a.status,
        date_format(a.installedDate, '%Y-%m-%d') as installedDate,
        date_format(a.commissionedDate, '%Y-%m-%d') as commissionedDate,
        date_format(a.decommissionedDate, '%Y-%m-%d') as decommissionedDate,
        date_format(a.disposedDate, '%Y-%m-%d') as disposedDate,
        a.created, a.updated, a.inuse
        from asset a
            left outer join asset b on a.assetRef = b.id
        where a.id = uid;
    end//

create procedure sp_updateAsset (in uid int, ownedByRef int, maintainedByRef int, locationCategoryRef int, name varchar(32), description varchar(256), status varchar(64), installedDate date, commissionedDate date, decommissionedDate date, disposedDate date, locationType varchar(8), locationDescription varchar(256), inuse boolean)
    begin
        update asset
        set ownedByRef = ownedByRef,
            maintainedByRef = maintainedByRef,
            locationCategoryRef = locationCategoryRef,
            name = name,
            description = description,
            status = status,
            installedDate = installedDate,
            commissionedDate = commissionedDate,
            decommissionedDate = decommissionedDate,
            disposedDate = disposedDate,
            locationType = locationType,
            locationDescription = locationDescription,
            inuse = inuse
        where id = uid;

        call sp_selectAsset(uid);

    end//

create procedure sp_updateAssetLocationMap (in uid int, location json)
    begin
        update asset
        set location = location
        where id = uid;

        call sp_selectAsset(uid);
    end//

create procedure sp_insertAssetLocationCategory (in name varchar(32), description varchar(256), out insertId int)
    begin
        insert into assetLocationCategory (name , description)
        value (name, description);

        set insertId := last_insert_id();
        select insertId;
    end//

create procedure sp_updateAssetLocationCategory (in uid int, name varchar(32), description varchar(256), inuse boolean)
    begin
        update assetLocationCategory
        set name = name,
            description = description,
            inuse = inuse
        where id = uid;

        call sp_selectAssetLocationCategories('');
    end//

create procedure sp_selectAssetLocationCategories (in searchText varchar(64))
    begin
        if(searchText <> '') then
            select id, name, description, created, updated, inuse from assetLocationCategory
            where match(name, description) against(searchText in boolean mode)
            order by name;
        else
            select id, name, description, created, updated, inuse from assetLocationCategory order by name;
        end if;
    end//

create procedure sp_selectAssetLocationCategoryList (in searchText varchar(64))
    begin
        if(searchText <> '') then
            select id, name, description from assetLocationCategory 
            where inuse = 1 
            and match(name, abbreviation, assetRole) against(searchText in boolean mode)
            order by name;
        else
            select id, name, description from assetLocationCategory where inuse = 1 order by name;
        end if;
    end//

create procedure sp_insertOrganisation (in name varchar(32), abbreviation varchar(4), assetRole varchar(16), out insertId int)
    begin
        insert into organisation (name, abbreviation, assetRole)
        value (name, abbreviation, assetRole);

        set insertId := last_insert_id();
        select insertId;
    end//

create procedure sp_updateOrganisation (in uid int, name varchar(32), abbreviation varchar(4), assetRole varchar(16), inuse boolean)
    begin
        update organisation
        set name = name,
            abbreviation = abbreviation,
            assetRole = assetRole,
            inuse = inuse
        where id = uid;

        call sp_selectOrganisations('');
    end//

create procedure sp_selectOrganisations (in searchText varchar(64))
    begin
        if(searchText <> '') then
            select id, name, abbreviation, assetRole, created, updated, inuse from organisation
            where match(name, abbreviation, assetRole) against(searchText in boolean mode)
            order by name;
        else
            select id, name, abbreviation, assetRole, created, updated, inuse from organisation order by name;
        end if;
    end//

create procedure sp_selectOrganisationList (in searchText varchar(64))
    begin
        if(searchText <> '') then
            select id, name, abbreviation, assetRole from organisation
            where inuse = 1
            and match(name, abbreviation, assetRole) against(searchText in boolean mode)
            order by name;
        else
            select id, name, abbreviation, assetRole from organisation where inuse = 1 order by name;
        end if;
    end//

create procedure sp_updateAssetAssetRef (in uid int, assetRef int)
    begin
        update asset
        set assetRef = assetRef
        where id = uid;

        call sp_selectAsset(uid);
    end//

create procedure sp_selectAssetDescendant (in uid int)
    begin

        with descendants as
            (
                 select  a.id, a.assetRef from asset a where a.id = uid
                    union all
                select a.id, a.assetRef from asset a inner join asset c on a.assetRef = c.id
            )

            select distinct id, assetRef from descendants order by id;

    end//

create procedure sp_deleteAsset (in uid int)
    begin

        with descendants as
            (
                select  a.id, a.assetRef from asset a where a.id = uid
                union all
                select a.id, a.assetRef from asset a inner join asset c on a.assetRef = c.id
            )

            update asset set inuse = 0 where id in (select distinct id from descendants order by id);
            
            call sp_selectAssets('');
    end//

create procedure sp_reinstateAsset (in uid int)
    begin

        with descendants as
            (
                select  a.id, a.assetRef from asset a where a.id = uid
                union all
                select a.id, a.assetRef from asset a inner join asset c on a.assetRef = c.id
            )

            update asset set inuse = 1 where id in (select distinct id from descendants order by id);
            
            call sp_selectAssets('');
    end//
-- DECLARE @parent varchar(10) = 'a';
-- WITH cte AS
-- (
--   select null parent, @parent child, 0 as level
--    union
--   SELECT  a.parent, a.child , 1 as level
--     FROM pc a
--    WHERE a.parent = @parent
--    UNION ALL
--   SELECT a.parent, a.child , c.level +    1
--     FROM pc a JOIN cte c ON a.parent = c.child
-- )
-- SELECT distinct parent, child , level
--   FROM cte
--  order by level, parent;


-- ************************
-- Roster Stored Procedures
-- ************************
create procedure sp_insertRoster (in name varchar(32), description varchar(256), out insertId int)
    begin
        insert into roster (name, description) values (name, description);

        set insertId := last_insert_id();
        select insertId;
    end//

delimiter ;