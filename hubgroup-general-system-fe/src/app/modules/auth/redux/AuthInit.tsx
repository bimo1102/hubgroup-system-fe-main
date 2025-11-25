import React, { FC, useRef, useEffect, useState } from 'react';
import { connect, useDispatch, ConnectedProps } from 'react-redux';
import { LayoutSplashScreen as LayoutSplashScreenComponent } from '../../../_metronic/layout/core';

const LayoutSplashScreen = React.memo(LayoutSplashScreenComponent);
import * as auth from './AuthRedux';
import { getUserByToken } from './AuthCRUD';
import { UserModel } from '../models/UserModel';

const mapState = () => ({ auth: '' });
const connector = connect(mapState, auth.actions);
interface AuthInitProps extends ConnectedProps<typeof connector> {
    children?: React.ReactNode;
}
export const fakeUser: UserModel = {
    id: 1,
    username: 'testuser',
    password: undefined,
    email: 'test@example.com',
    firstname: 'John',
    lastname: 'Doe',
    fullname: 'John Doe',
    occupation: 'Developer',
    companyName: 'TechCorp',
    phone: '0123456789',
    roles: [1, 2],
    pic: 'https://via.placeholder.com/150',
    language: 'en',
    timeZone: 'Asia/Ho_Chi_Minh',
    website: 'https://keenthemes.com',
    emailSettings: {
        sendCopyToPersonalEmail: false,
        activityRelatesEmail: {
            youHaveNewNotifications: true,
            youAreSentADirectMessage: true,
            someoneAddsYouAsAsAConnection: false,
            uponNewOrder: true,
            newMembershipApproval: false,
            memberRegistration: false,
        },
        updatesFromKeenthemes: {
            newsAboutKeenthemesProductsAndFeatureUpdates: true,
            tipsOnGettingMoreOutOfKeen: true,
            thingsYouMissedSindeYouLastLoggedIntoKeen: true,
        },
    },
    auth: {
        accessToken: 'FAKE_TOKEN_ABCXYZ',
        refreshToken: 'FAKE_REFRESH_TOKEN',
    },
    communication: {
        email: true,
        sms: false,
        phone: false,
    },
    address: {
        addressLine: '123 Nguyen Van Cu',
        city: 'Ho Chi Minh City',
        state: 'HCM',
        postCode: '700000',
    },
    socialNetworks: {
        linkedIn: 'linkedin.com/in/test',
        facebook: 'facebook.com/test',
        twitter: 'twitter.com/test',
        instagram: '@test',
    },
};
const AuthInit: FC<AuthInitProps> = (props) => {
    const didRequest = useRef(false);
    const dispatch = useDispatch();
    const [showSplashScreen, setShowSplashScreen] = useState(true);
    // const accessToken = useSelector<RootState>(({ auth }) => auth.accessToken, shallowEqual);

    // We should request user by authToken before rendering the application
    useEffect(() => {
        const requestUser = async () => {
            try {
                if (!didRequest.current) {
                    dispatch(props.fulfillUser(fakeUser));
                }
            } catch (error) {
                console.error(error);
                if (!didRequest.current) {
                    dispatch(props.logout());
                }
            } finally {
                setShowSplashScreen(false);
            }

            return () => (didRequest.current = true);
        };

        if (true) {
            requestUser();
        } else {
            dispatch(props.logout());
            setShowSplashScreen(false);
        }
        // eslint-disable-next-line
    }, []);

    return showSplashScreen ? <LayoutSplashScreen /> : <>{props.children}</>;
};

export default connector(AuthInit);
