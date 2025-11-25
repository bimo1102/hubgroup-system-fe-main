/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useRef, useState } from 'react';
import { KTSVG, toAbsoluteUrl } from '../../../helpers';

interface ICreateAccount {
    appName: string;
    category: string;
    framework: string;
    dbName: string;
    dbType: string;
    nameOnCard: string;
    cardNumber: string;
    cardExpiryMonth: string;
    cardExpiryYear: string;
    cardCvv: string;
    saveCard: string;
}

const inits: ICreateAccount = {
    appName: '',
    category: '1',
    framework: '1',
    dbName: '',
    dbType: '1',
    nameOnCard: 'Max Doe',
    cardNumber: '4111 1111 1111 1111',
    cardExpiryMonth: '1',
    cardExpiryYear: '2025',
    cardCvv: '123',
    saveCard: '1',
};

const Main: FC = () => {
    const stepperRef = useRef<HTMLDivElement | null>(null);
    const [initValues] = useState<ICreateAccount>(inits);

    const loadStepper = () => {};

    useEffect(() => {
        if (!stepperRef.current) {
            return;
        }

        loadStepper();
    }, [stepperRef]);

    return (
        <div className="modal fade" id="kt_modal_create_app" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered mw-900px">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Create App</h2>

                        <div className="btn btn-sm btn-icon btn-active-color-primary" data-bs-dismiss="modal">
                            <KTSVG path="/media/icons/duotune/arrows/arr061.svg" className="svg-icon-1" />
                        </div>
                    </div>

                    <div className="modal-body py-lg-10 px-lg-10">
                        <div
                            ref={stepperRef}
                            className="stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid"
                            id="kt_modal_create_app_stepper">
                            <div className="d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px">
                                <div className="stepper-nav ps-lg-10">
                                    <div className="stepper-item current" data-kt-stepper-element="nav">
                                        <div className="stepper-line w-40px"></div>

                                        <div className="stepper-icon w-40px h-40px">
                                            <i className="stepper-check fas fa-check"></i>
                                            <span className="stepper-number">1</span>
                                        </div>

                                        <div className="stepper-label">
                                            <h3 className="stepper-title">Details</h3>

                                            <div className="stepper-desc">Name your App</div>
                                        </div>
                                    </div>

                                    <div className="stepper-item" data-kt-stepper-element="nav">
                                        <div className="stepper-line w-40px"></div>

                                        <div className="stepper-icon w-40px h-40px">
                                            <i className="stepper-check fas fa-check"></i>
                                            <span className="stepper-number">2</span>
                                        </div>

                                        <div className="stepper-label">
                                            <h3 className="stepper-title">Frameworks</h3>

                                            <div className="stepper-desc">Define your app framework</div>
                                        </div>
                                    </div>

                                    <div className="stepper-item" data-kt-stepper-element="nav">
                                        <div className="stepper-line w-40px"></div>

                                        <div className="stepper-icon w-40px h-40px">
                                            <i className="stepper-check fas fa-check"></i>
                                            <span className="stepper-number">3</span>
                                        </div>

                                        <div className="stepper-label">
                                            <h3 className="stepper-title">Database</h3>

                                            <div className="stepper-desc">Select the app database type</div>
                                        </div>
                                    </div>

                                    <div className="stepper-item" data-kt-stepper-element="nav">
                                        <div className="stepper-line w-40px"></div>

                                        <div className="stepper-icon w-40px h-40px">
                                            <i className="stepper-check fas fa-check"></i>
                                            <span className="stepper-number">4</span>
                                        </div>

                                        <div className="stepper-label">
                                            <h3 className="stepper-title">Billing</h3>

                                            <div className="stepper-desc">Provide payment details</div>
                                        </div>
                                    </div>

                                    <div className="stepper-item" data-kt-stepper-element="nav">
                                        <div className="stepper-line w-40px"></div>

                                        <div className="stepper-icon w-40px h-40px">
                                            <i className="stepper-check fas fa-check"></i>
                                            <span className="stepper-number">5</span>
                                        </div>

                                        <div className="stepper-label">
                                            <h3 className="stepper-title">Release</h3>

                                            <div className="stepper-desc">Review and Submit</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-row-fluid py-lg-5 px-lg-15"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Main };
