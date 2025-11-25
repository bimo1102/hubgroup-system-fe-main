import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import * as auth from './redux/AuthRedux';

export function Logout() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(auth.actions.logout());
        document.location.reload();
    }, [dispatch]);

    return (
        <Routes>
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
    );
}
