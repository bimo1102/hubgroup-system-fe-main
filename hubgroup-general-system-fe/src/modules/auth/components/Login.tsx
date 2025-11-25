/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import * as auth from '../redux/AuthRedux';
import { login } from '../redux/AuthCRUD';
import { toAbsoluteUrl } from '../../../_metronic/helpers';

const initialValues = {
    email: 'admin@demo.com',
    password: 'demo',
};

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    return (
        <form className="form w-100" noValidate id="kt_login_signin_form">
            {/* begin::Heading */}
            <div className="text-center mb-10">
                <h1 className="text-dark mb-3">Sign In to Metronic</h1>
                <div className="text-gray-400 fw-bold fs-4">
                    New Here?{' '}
                    <Link to="/auth/registration" className="link-primary fw-bolder">
                        Create an Account
                    </Link>
                </div>
            </div>
            {/* begin::Heading */}

            {/* begin::Form group */}
            <div className="fv-row mb-10">
                <label className="form-label fs-6 fw-bolder text-dark">Email</label>
                <input placeholder="Email" type="email" name="email" autoComplete="off" />
            </div>
            {/* end::Form group */}

            {/* begin::Form group */}
            <div className="fv-row mb-10">
                <div className="d-flex justify-content-between mt-n5">
                    <div className="d-flex flex-stack mb-2">
                        {/* begin::Label */}
                        <label className="form-label fw-bolder text-dark fs-6 mb-0">Password</label>
                        {/* end::Label */}
                        {/* begin::Link */}
                        <Link
                            to="/auth/forgot-password"
                            className="link-primary fs-6 fw-bolder"
                            style={{ marginLeft: '5px' }}>
                            Forgot Password ?
                        </Link>
                        {/* end::Link */}
                    </div>
                </div>
                <input type="password" autoComplete="off" />
            </div>
            {/* end::Form group */}

            {/* begin::Action */}
            <div className="text-center">
                <button type="submit" id="kt_sign_in_submit" className="btn btn-lg btn-primary w-100 mb-5">
                    {!loading && <span className="indicator-label">Continue</span>}
                    {loading && (
                        <span className="indicator-progress" style={{ display: 'block' }}>
                            Please wait...
                            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                    )}
                </button>

                {/* begin::Separator */}
                <div className="text-center text-muted text-uppercase fw-bolder mb-5">or</div>
                {/* end::Separator */}

                {/* begin::Google link */}
                <a href="#" className="btn btn-flex flex-center btn-light btn-lg w-100 mb-5">
                    <img alt="Logo" className="h-20px me-3" />
                    Continue with Google
                </a>
                {/* end::Google link */}

                {/* begin::Google link */}
                <a href="#" className="btn btn-flex flex-center btn-light btn-lg w-100 mb-5">
                    <img alt="Logo" className="h-20px me-3" />
                    Continue with Facebook
                </a>
                {/* end::Google link */}

                {/* begin::Google link */}
                <a href="#" className="btn btn-flex flex-center btn-light btn-lg w-100">
                    <img alt="Logo" className="h-20px me-3" />
                    Continue with Apple
                </a>
                {/* end::Google link */}
            </div>
            {/* end::Action */}
        </form>
    );
}
