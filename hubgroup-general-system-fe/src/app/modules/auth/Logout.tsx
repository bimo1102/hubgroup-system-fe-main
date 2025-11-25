import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';

export function Logout() {
    //action logout
    // useEffect(() => {
    //     dispatch(auth.actions.logout());
    //     document.location.reload();
    // }, [dispatch]);

    return (
        <Routes>
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
    );
}
