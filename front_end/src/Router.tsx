import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import routerMeta, { IRouterMeta } from './lib/routerMeta';
//import LoadingFallback from '@/components/LoadingFallback';
//import ProtectedRoute from '@/components/HOC/ProtectedRoute';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
//import { ErrorBoundary } from 'react-error-boundary';
//import ErrorFallback from '@/components/ErrorFallback';
//import Layout from '@/components/common/Layout';

const lazyImport = (pageName: string) => lazy(() => import(`./pages/${pageName}`));

const assignRouter = Object.keys(routerMeta).map((componentKey: string) => {
  const props: IRouterMeta = routerMeta[componentKey];

  return {
    Component: lazyImport(componentKey),
    props,
  };
});

const Router = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Routes>
      <Route>
        {assignRouter.map(({ Component, props }) => (
          <Route
            key={props.path}
            path={props.path}
            element={
                <Component />
                /*
              <ProtectedRoute path={props.path}>
                <Suspense fallback={<LoadingFallback />}>
                  <ErrorBoundary
                    onReset={reset}
                    fallbackRender={({ resetErrorBoundary }) => (
                      <ErrorFallback resetErrorBoundary={resetErrorBoundary} />
                    )}
                  >
                    <Component />
                  </ErrorBoundary>
                </Suspense>
              </ProtectedRoute>
              */
            }
          />
        ))}
      </Route>
    </Routes>
  );
};

export default Router;
