declare global {
    interface Window {
        SSOModuleUrl: string;
        ReceptionModuleUrl: string;
        NewsModuleUrl: string;
        moduleMap: Record<string, any>;
        [key: string]: string
    }
    module './ReceptionModule/*';
    module 'NewsModule/*' {
        export class NewsModule {}
        export class NewsCategoryModule {}
    };
    module 'ProductModule/*' {
        export class ProductModule {}
        export class CategoryModule {}
        export class VariationModule {}
        export class AttributeModule {}
        export class Vendor {}
        export class ManufacturerModule {}
        export class MeasureUnitsModule {}
    };
    module 'SSOModule/*';
    module 'React_remote/*';
}

export {};
