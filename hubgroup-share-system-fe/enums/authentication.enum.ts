export enum OtpTypeEnum
{
    LoginByPhone = 1,
    EmailConfirmed = 2,
    PhoneNumberConfirmed = 4,
    OTPByEmail = 8,
    OTPBySMS = 16,
    OTPByApp = 32,
    SmartOTP = 64,
    QR = 128
}

export enum QRTypeEnum {
    Login = 1,
    VerifyTwoFactor = 2
}
