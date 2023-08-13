drop procedure if exists sp_getAssets;

delimiter //

create procedure sp_getAssets (in searchText CHAR(64))
    begin
         select id, assetRef, ownedByRef, maintainedByRef, name, operational from asset;
    end//

delimiter ;