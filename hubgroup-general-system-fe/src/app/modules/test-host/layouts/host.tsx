import React, { useEffect, useState } from 'react';
import ButtonAdd from '@hubgroup-share-system-fe/react/components/common/buttons/button-add';
import { useAppSelector, useAppDispatch } from 'src/app/shareds/hooks/useStore';
import { commonActions } from '@hubgroup-share-system-fe/react/providers/context/common.reducer';
import { additionalInformationGetById } from 'src/shareds/providers/redux/actions/test.action';
// import { useDispatch } from 'react-redux';
type Props = {};

const ServiceCategoryModule = React.lazy(() => import('GeneralReactModule/service-category'));

const Host: React.FC<Props> = () => {
    const { count } = useAppSelector((state) => state.common);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const response = dispatch(additionalInformationGetById({ surveyId: '58555125-3746-4f94-9330-f84480094327' }));
    }, [dispatch]);
    return (
        <div className="main-wrapper">
            <div className="flex flex-row gap-10 p-5">
                Service Category List: {count}
                <ButtonAdd onClick={() => dispatch(commonActions.setCount(count + 1))} text="plus" />
                <ButtonAdd
                    onClick={() => dispatch(commonActions.setCount(count - 1))}
                    text="minus"
                    keenIconName="minus"
                />
            </div>

            <React.Suspense fallback="Loading service category...">
                <ServiceCategoryModule />
            </React.Suspense>
        </div>
    );
};

export default Host;
