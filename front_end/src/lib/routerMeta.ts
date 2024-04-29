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
    ProjectsOverviewPage: {
        name: 'ProjectsOverviewPage',
        path: '/',
        isShow: true,
        isCommon: true
    },
    ProjectPage: {
        name: 'ProjectPage',
        path: '/project/:id',
        isShow: true,
        isCommon: true
    }
};

export default routerMeta;
