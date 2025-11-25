import { TypedUseSelectorHook, useSelector, useDispatch, useStore } from 'react-redux';
import { RootState, Dispatch } from 'GeneralApplication/store';
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => Dispatch = useDispatch;
