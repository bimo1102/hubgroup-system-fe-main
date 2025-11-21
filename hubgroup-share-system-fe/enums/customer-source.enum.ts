export enum CleansingCusDataSource {
    ClientAll = 0,
    PropectCustomer = 1,
    ProposalCustomer = 2,
    ContractCustomer = 3,
    ServiceCustomer = 4,
    TrsCustomer = 5,
    VocCustomer = 6,
    NpsCustomerCsi = 7,
    NpsCustomerSsi = 8,
    MrsCustomer = 9,
    LoyaltyCustomer = 10,
    CustomerOne = 11,
}

export enum CleansingCusDataRule {
    CustomerTel = 1,
    CustomerName = 2,
    CustomerAddress = 3,
}

export enum CombineType {
    Manual = 1,
    Auto = 2,
}

export enum CusRole {
    Owner = 1,
    Manager = 2,
    Driver = 3,
    Other = 9,
}

export enum TmssAppointmentStatus {
    New = 0,
    Confirmed = 1,
    WshopBooked = 2,
    Change = 3,
    Canceled = 4,
    CanceledAfterOrdered = 5,
    NoShow = 6,
    NoShowAfterOrdered = 7,
    Done = 8,
}

export enum ServiceOrderHistoryStatusEnum {
    Remove = -1,
    TempQuotation = 0,
    Quotation = 10,
    PartHandOver = 15,
    RepairOrder = 20,
    Repairing = 30,
    RepairCompleted = 35,
    Stopping = 40,
    Completed = 50,
    Settlement = 60,
    Canceled = 70,
    OutGate = 90,
    QualityControl = 110,
    CarWashing = 120,
}

export enum TmssClaimStatus {
    InProgress = 0,
    Closed = 2,
}

export enum VhcTypeEnum {
    FourSeatCar = 1,
    SevenSeaterCar = 2,
    SixteenSeaterCar = 3,
    PickUpTruck = 4,
    Hatchback = 5
}

export enum CusVehicleRecallStatusEnum {
    Completed = 1,
    InCompleted = 2
}

export enum TiConfigOption {
    Ti = 1,
    NonTi = 2
}

export enum TmssInsurancePackageEnum {
    Gold = 1,
    Silver = 2,
    Bronze = 3
}

export enum AppointmentStatusEnum {
    Soon = 1,
    OnTime = 2,
    Late = 3
}

export enum RegisRemindEnum {
    NotRemind = 0,
    Reminded = 1,
    Checked = 2,
    Registed = 3
}

export enum InsuranceRemindEnum {
    NotRemind = 0,
    Reminded = 1,
    Bought = 2
}

export enum BirthRemindEnum {
    NotRemind = 0,
    Reminded = 1,
    Gifted = 2
}

export enum PromoRemindEnum {
    NotRemind = 0,
    Reminded = 1,
    Done = 2,
    Gifted = 3
}

export enum RecallCampRemindEnum {
    NotRemind = 0,
    Reminded = 1,
    Done = 2
}

export enum TmssRoType {
    All = 0,
    BP = 1,
    GJ = 2,
    XM = 3,
    Other = 4,
    PM = 5
}

export enum DetailCustomerOneProcessEnum {
    LeadCustomer = 1,
    SaleCustomer = 2,
    ServiceCustomer = 3,
    RepeatCustomer = 4
}

export enum MstSlePaymentTypeEnum {
    Cash = 1,
    Installment = 2,
    Leasing = 3,
    DelayPayment = 5,
    Bank = 6
}