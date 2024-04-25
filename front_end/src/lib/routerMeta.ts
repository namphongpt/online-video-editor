export interface IRouterMeta {
    name?: string;
    path: string;
    isShow: boolean;
    isCommon?: boolean;
    isAuth?: boolean;
    icon?: string;
}

export type RouterMetaType = {
    [key: string]: IRouterMeta;
};

const routerMeta: RouterMetaType = {
    HomePage: {
        name: 'Home',
        path: '/',
        isShow: true,
        isCommon: true
    }
};

export default routerMeta;
