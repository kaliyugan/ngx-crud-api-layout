import { Permission } from "./Permission";
import { ColumnConfig } from "./ColumnConfig";

export class MasterScreen{
    id:string;
    name:string;
    description:string;
    permission:Permission;
    columnConfig:ColumnConfig[];
    size:string;
}