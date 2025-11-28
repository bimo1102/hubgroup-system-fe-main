// /**
//  * EXAMPLE: Complete Redux Reducer Setup for Remote Module
//  *
//  * This shows how to properly structure and register reducers
//  * for sharing between host and remote modules.
//  */

// /**
//  * ============================================================================
//  * FILE 1: Redux Slice (Action Creators + Reducer)
//  * ============================================================================
//  * Path: hubgroup-general-react-system-fe/src/modules/user/redux/userSlice.ts
//  */

// import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

// /**
//  * User state interface
//  */
// export interface User {
//     id: string;
//     name: string;
//     email: string;
//     role: 'admin' | 'user';
// }

// export interface UserState {
//     list: User[];
//     currentUser: User | null;
//     loading: boolean;
//     error: string | null;
// }

// const initialState: UserState = {
//     list: [],
//     currentUser: null,
//     loading: false,
//     error: null,
// };

// /**
//  * Async thunk for fetching users from API
//  */
// export const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, { rejectWithValue }) => {
//     try {
//         // Call API
//         const response = await fetch('/api/users');
//         if (!response.ok) throw new Error('Failed to fetch users');
//         return await response.json();
//     } catch (error) {
//         return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
//     }
// });

// /**
//  * User slice
//  */
// export const userSlice = createSlice({
//     name: 'user',
//     initialState,
//     reducers: {
//         // Synchronous actions
//         setCurrentUser: (state, action: PayloadAction<User | null>) => {
//             state.currentUser = action.payload;
//         },
//         addUser: (state, action: PayloadAction<User>) => {
//             state.list.push(action.payload);
//         },
//         removeUser: (state, action: PayloadAction<string>) => {
//             state.list = state.list.filter((u) => u.id !== action.payload);
//         },
//         updateUser: (state, action: PayloadAction<User>) => {
//             const index = state.list.findIndex((u) => u.id === action.payload.id);
//             if (index > -1) {
//                 state.list[index] = action.payload;
//             }
//         },
//         clearError: (state) => {
//             state.error = null;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             // Fetch users
//             .addCase(fetchUsers.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchUsers.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.list = action.payload;
//             })
//             .addCase(fetchUsers.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             });
//     },
// });

// // Export actions
// export const { setCurrentUser, addUser, removeUser, updateUser, clearError } = userSlice.actions;

// // Export reducer (for injection)
// export default userSlice.reducer;

// /**
//  * ============================================================================
//  * FILE 2: Selectors (for accessing state)
//  * ============================================================================
//  * Path: hubgroup-general-react-system-fe/src/modules/user/redux/userSelectors.ts
//  */

// export const selectUsers = (state: any) => state.user?.list || [];
// export const selectCurrentUser = (state: any) => state.user?.currentUser || null;
// export const selectUserLoading = (state: any) => state.user?.loading || false;
// export const selectUserError = (state: any) => state.user?.error || null;

// /**
//  * ============================================================================
//  * FILE 3: Component Using Injected Reducer
//  * ============================================================================
//  * Path: hubgroup-general-react-system-fe/src/modules/user/UserList.tsx
//  */

// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useInjectReducer } from 'src/app/shareds/hooks/useInjectReducer';
// import userReducer, { fetchUsers, setCurrentUser } from './redux/userSlice';
// import { selectUsers, selectCurrentUser, selectUserLoading, selectUserError } from './redux/userSelectors';

// /**
//  * Main component for user module
//  */
// export const UserModule = () => {
//     // Inject reducer on mount, cleanup on unmount
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

// /**
//  * Display list of users
//  */
// const UserList: React.FC = () => {
//     const dispatch = useDispatch();
//     const users = useSelector(selectUsers);
//     const loading = useSelector(selectUserLoading);
//     const error = useSelector(selectUserError);

//     // Fetch users on mount
//     useEffect(() => {
//         dispatch(fetchUsers() as any);
//     }, [dispatch]);

//     if (loading) return <div>Loading users...</div>;
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <div>
//             <h2>Users</h2>
//             <ul>
//                 {users.map((user: any) => (
//                     <li key={user.id}>
//                         <strong>{user.name}</strong> ({user.email})
//                         <button onClick={() => dispatch(setCurrentUser(user))}>Select</button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// /**
//  * Create new user form
//  */
// const CreateUserForm: React.FC = () => {
//     const dispatch = useDispatch();
//     const [name, setName] = React.useState('');
//     const [email, setEmail] = React.useState('');

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         // Dispatch action to create user
//         console.log('Creating user:', { name, email });
//         setName('');
//         setEmail('');
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <h3>Create User</h3>
//             <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
//             <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//             <button type="submit">Create</button>
//         </form>
//     );
// };

// /**
//  * ============================================================================
//  * FILE 4: Export from Remote Module (Federation Entry)
//  * ============================================================================
//  * Path: hubgroup-general-react-system-fe/src/modules/user/index.tsx
//  */

// export { UserModule as default };

// /**
//  * ============================================================================
//  * USAGE IN HOST APP
//  * ============================================================================
//  */

// // Host just imports and uses like normal component:
// //
// // import UserModule from 'GeneralReactModule/user';
// //
// // Then in routes:
// // {
// //   path: 'users',
// //   element: (
// //     <Suspense fallback={<FallbackView />}>
// //       <UserModule />  // Auto-injects reducer on mount!
// //     </Suspense>
// //   ),
// // }
// //
// // Host can access user state:
// // const users = useSelector(state => state.user.list);
// // const dispatch = useDispatch();
// // dispatch(setCurrentUser(user)); // Works in host!

// export {};
