// /**
//  * REDUX REDUCER SHARING GUIDE
//  *
//  * This guide explains how to share reducers between Host and Remote modules
//  * in a Module Federation setup with dynamic reducer injection.
//  */

// /**
//  * ============================================================================
//  * OPTION 1: Remote Module Registers Reducer with Host Store
//  * ============================================================================
//  *
//  * Use this when remote module should share state with host and other modules.
//  * Reducer is injected into host's Redux store at runtime.
//  */

// // ✅ EXAMPLE: Remote Module (UserModule)
// // File: hubgroup-general-react-system-fe/src/modules/user/index.tsx

// import { useEffect } from 'react';
// import { Provider, useDispatch, useSelector } from 'react-redux';
// import { useInjectReducer } from 'src/app/shareds/hooks/useInjectReducer';
// // or import from host via MFE: import { useInjectReducer } from 'GeneralApplication/hooks';
// import userReducer from './redux/userSlice';

// export const UserModule = () => {
//     // Inject reducer on mount, auto-cleanup on unmount
//     const injected = useInjectReducer('user', userReducer, { cleanup: true });

//     if (!injected) {
//         return <div>Failed to load user module</div>;
//     }

//     return (
//         <div>
//             <UserList />
//             <CreateUserForm />
//         </div>
//     );
// };

// // Components can now use Redux state from host store
// const UserList = () => {
//     const users = useSelector((state: any) => state.user.list);
//     const dispatch = useDispatch();

//     return (
//         <div>
//             {/* Render users from host store */}
//             {users.map((user: any) => (
//                 <div key={user.id}>{user.name}</div>
//             ))}
//         </div>
//     );
// };

// const CreateUserForm = () => {
//     const dispatch = useDispatch();

//     return (
//         <form>
//             {/* Dispatch actions to host store */}
//         </form>
//     );
// };

// export default UserModule;

// /**
//  * ============================================================================
//  * OPTION 2: Remote Module Uses Own Reducer (Standalone)
//  * ============================================================================
//  *
//  * Use this when remote module has isolated state and doesn't need to share
//  * with host or other modules.
//  */

// // ✅ EXAMPLE: Standalone Remote Module
// // File: hubgroup-general-react-system-fe/src/modules/product/index.tsx

// import { Provider } from 'react-redux';
// import { configureStore } from '@reduxjs/toolkit';
// import productReducer from './redux/productSlice';

// // Create standalone store for this module only
// const standalonStore = configureStore({
//     reducer: {
//         product: productReducer,
//     },
// });

// export const ProductModule = () => {
//     return (
//         <Provider store={standalonStore}>
//             <ProductList />
//         </Provider>
//     );
// };

// /**
//  * ============================================================================
//  * OPTION 3: Export Reducers for Host to Register (Recommended for MFE)
//  * ============================================================================
//  *
//  * Best practice: remote module exports reducers, host registers them.
//  * Gives host full control over when/how reducers are injected.
//  */

// // ✅ EXAMPLE: Remote Module Exports Reducer
// // File: hubgroup-general-react-system-fe/src/modules/order/redux/index.ts

// import { createSlice } from '@reduxjs/toolkit';

// export const orderSlice = createSlice({
//     name: 'order',
//     initialState: {
//         list: [],
//         loading: false,
//         error: null,
//     },
//     reducers: {
//         setOrders: (state, action) => {
//             state.list = action.payload;
//         },
//         setLoading: (state, action) => {
//             state.loading = action.payload;
//         },
//         setError: (state, action) => {
//             state.error = action.payload;
//         },
//     },
// });

// export const { setOrders, setLoading, setError } = orderSlice.actions;
// export default orderSlice.reducer;

// // File: hubgroup-general-react-system-fe/src/modules/order/index.tsx

// import { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useInjectReducer } from 'src/app/shareds/hooks/useInjectReducer';
// import orderReducer, { setOrders } from './redux';

// export const OrderModule = () => {
//     const dispatch = useDispatch();
//     const orders = useSelector((state: any) => state.order?.list || []);
//     const loading = useSelector((state: any) => state.order?.loading);

//     // Inject reducer on mount
//     useInjectReducer('order', orderReducer);

//     useEffect(() => {
//         // Fetch orders
//         dispatch(setOrders([...]));
//     }, []);

//     if (loading) return <div>Loading...</div>;

//     return (
//         <div>
//             {orders.map((order: any) => (
//                 <div key={order.id}>{order.name}</div>
//             ))}
//         </div>
//     );
// };

// /**
//  * ============================================================================
//  * OPTION 4: Host Explicitly Registers Remote Reducers
//  * ============================================================================
//  *
//  * Use when host routes to remote modules and wants explicit control.
//  * Useful for preloading reducers before component mount.
//  */

// // ✅ EXAMPLE: Host Routes config
// // File: hubgroup-general-system-fe/src/app/routing/PrivateRoutes.tsx

// import { lazy, Suspense } from 'react';
// import { injectReducer } from 'src/app/shareds/providers/redux/store';
// import FallbackView from 'src/_metronic/partials/FallbackView';

// // Dynamic import remote module
// const OrderModule = lazy(() => import('GeneralReactModule/order'));

// // Pre-register reducer (before lazy load)
// // This ensures state is available before component renders
// export const privateRoutes = [
//     {
//         path: 'orders',
//         element: (
//             <Suspense fallback={<FallbackView />}>
//                 <OrderModule />
//             </Suspense>
//         ),
//     },
// ];

// /**
//  * ============================================================================
//  * BEST PRACTICES
//  * ============================================================================
//  *
//  * 1. ✅ Use useInjectReducer hook for automatic cleanup
//  *    - Avoids memory leaks
//  *    - Cleaner code
//  *
//  * 2. ✅ Define unique reducer keys per module
//  *    - e.g., 'user', 'product', 'order'
//  *    - Prevents collisions
//  *
//  * 3. ✅ Use Redux Toolkit slices for reducer creation
//  *    - Cleaner than hand-written reducers
//  *    - Built-in immer for immutable updates
//  *
//  * 4. ✅ Export action creators alongside reducers
//  *    - Makes actions discoverable
//  *    - Type-safe dispatch
//  *
//  * 5. ✅ Lazy load remote modules
//  *    - Better code splitting
//  *    - Faster initial load
//  *
//  * 6. ✅ Log reducer registration/cleanup
//  *    - Debug modules loading/unloading
//  *    - Detect issues early
//  *
//  * 7. ✅ Handle store unavailable gracefully
//  *    - Fallback to standalone store
//  *    - Don't break when host not running
//  */

// /**
//  * ============================================================================
//  * TROUBLESHOOTING
//  * ============================================================================
//  *
//  * Q: "Reducer already exists" error
//  * A: Check if reducer was already injected by another route/component
//  *    Use overwrite option if intentional: useInjectReducer('key', reducer, { overwrite: true })
//  *
//  * Q: State persists after remote module unmounts
//  * A: Ensure autoCleanup is enabled (default: true)
//  *    Or manually call ejectReducer() in cleanup
//  *
//  * Q: Remote module can't access host store
//  * A: Verify host store is exposed in federation.config.js:
//  *    exposes: { './store': './src/app/shareds/providers/redux/store.tsx' }
//  *
//  * Q: Multiple modules with same reducer state
//  * A: Use different keys for each module
//  *    e.g., 'user', 'admin-user', 'guest-user'
//  */

// export {};
