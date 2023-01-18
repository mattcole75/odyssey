drop database if exists core;
create database core;

use core;

-- an asset is a physical space allocated to provide functionality that satisfies some requirement
create table asset (
    id int not null auto_increment,

    assetRef int null, -- where in the world is this asset ref to the location service
    ownedByRef varchar(64) not null, -- which organisation ownes this asset ref to the organisation service

    name varchar(32) not null unique, -- the name describing the asset is unique
    description varchar(256) not null, -- a short functional description or contract requirement

    operational boolean not null default false, -- is the asset operational
    operationalStarDate datetime null, -- when did the asset begin it's operational life
    operationalEndDate datetime null, -- when did the asset end it's operational life

    locationType varchar(32) not null, -- constrain to the following values: Area or Pin
    area polygon null, -- a series of coordinates (lat lng)
    pin point null, -- a single coordinate (lat lng)
    -- latitude decimal(10, 8) null, -- location latitude
    -- longitude decimal(11, 8) null, -- location logitude

    created datetime not null default now(), -- when was this record created
    updated datetime not null default now() on update now(), -- when was the last time this record was updated
    inUse boolean not null default true, -- can this record be used / viewed
    
    primary key (id),
    constraint fk_asset_assetRef foreign key (assetRef) references asset (id) on update cascade on delete cascade,
    constraint ck_asset_locationType check (locationType in ('Area', 'Pin'))
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

    created datetime not null default now(),
    updated datetime not null default now() on update now(),
    inUse boolean not null default true,

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

    created datetime not null default now(),
    updated datetime not null default now() on update now(),
    inUse boolean not null default true,

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

    created datetime not null default now(),
    updated datetime not null default now() on update now(),
    inUse boolean not null default true,

    primary key (id),
    constraint fk_equipmentTanc_equipmentRef foreign key (equipmentRef) references equipment (id) on update cascade on delete cascade
);
