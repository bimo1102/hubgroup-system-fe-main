import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
// Import types only to avoid bundlers trying to resolve federated modules at build time
import type { RootState as HostRootState, Dispatch as HostDispatch } from 'GeneralApplication/store';
import type { RootState as RemoteRootState, Dispatch as RemoteDispatch } from '@shareds/providers/redux/store';

// Use a union of host and local root state so the selector works in both contexts.
export type AppRootState = Partial<HostRootState> & Partial<RemoteRootState>;
export type AppDispatch = HostDispatch | RemoteDispatch;

export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector;
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
