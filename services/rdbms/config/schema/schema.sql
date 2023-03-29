drop database if exists odyssey;
create database odyssey;

use odyssey;

-- an asset is a physical space allocated to provide functionality that satisfies some requirement
create table asset (
    id int not null auto_increment, -- the primary key

    assetRef int null, -- reference to a perent child relationship, null would indicate the asset at the top of the hierarchy
    ownedByRef varchar(64) null, -- the organisation who ownes this asset ref - organisation service
    maintainedByRef varchar(64) null, -- the organisation who maintains this asset - organisation service
    locationCategoryRef varchar(64) null, -- what type of access is required Red Zone, Segregated, Street Running

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
    constraint ck_asset_status check (status in ('design', 'procure', 'installed', 'commissioned', 'decommissioned', 'disposed')),
    constraint ck_asset_locationType check (locationType in ('area', 'point'))
);

-- the specific equioment model details
create table equipmentModel (
    id int not null auto_increment,

    manufacturerRef varchar(64) not null, -- the organisational reference for the manufacturer this reference the organisation service

    partNumber varchar(64),
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

-- *********************
-- Stored Procedures
-- *********************

-- drop procedure if exists sp_getAssets;

delimiter //
create procedure sp_selectAssets (in searchText varchar(64))
    begin
        if(searchText <> '') then
            select id, assetRef, ownedByRef, maintainedByRef, name, status from asset
            where match(name, description, status) against(searchText in boolean mode)
            order by name;
        else
            select id, assetRef, ownedByRef, maintainedByRef, name, status from asset 
            where assetRef is null
            order by name;
        end if;
    end//

create procedure sp_selectContainedAssets (in uid int)
    begin
        select id, assetRef, ownedByRef, maintainedByRef, name, status from asset 
            where assetRef = uid
            order by name;
    end//

create procedure sp_insertAsset (in assetRef int, ownedByRef varchar(64), maintainedByRef varchar(64), name varchar(32), description varchar(256), out insertId int)
    begin
        insert into asset (assetRef, ownedByRef, maintainedByRef, name, description)
        values (assetRef, ownedByRef, maintainedByRef, name, description);

        set insertId := last_insert_id();
        select insertId;
    end//

create procedure sp_selectAsset (in uid int)
    begin
        select 
        id, assetRef, ownedByRef, maintainedByRef, locationCategoryRef, name, description, locationType, location, locationDescription, status,
        date_format(installedDate, '%Y-%m-%d') as installedDate,
        date_format(commissionedDate, '%Y-%m-%d') as commissionedDate,
        date_format(decommissionedDate, '%Y-%m-%d') as decommissionedDate,
        date_format(disposedDate, '%Y-%m-%d') as disposedDate,
        created, updated, inuse from asset where id = uid;
    end//

create procedure sp_updateAsset (in uid int, ownedByRef varchar(64), maintainedByRef varchar(64), locationCategoryRef varchar(64), name varchar(32), description varchar(256), status varchar(64), installedDate date, commissionedDate date, decommissionedDate date, disposedDate date, locationType varchar(8), locationDescription varchar(256), inuse boolean)
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

create procedure sp_updateAssetLocation (in uid int, location json)
    begin
        update asset
        set location = location
        where id = uid;

        call sp_selectAsset(uid);
    end//

delimiter ;