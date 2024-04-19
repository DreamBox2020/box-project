import { Navigate, RouteObject } from 'react-router-dom'

import LayoutDashboard from '~/pages/dashboard/_layout'
import PageDashboard from '~/pages/dashboard'
import PageLogin from '~/pages/login'
import LayoutPermissions from '~/pages/permissions/_layout'
import PagePermissionsPolicies from '~/pages/permissions/policies'
import PagePermissionsRoles from '~/pages/permissions/roles'

const routes: RouteObject[] = [
  {
    path: '*',
    element: undefined,
    children: [
      {
        path: 'dashboard/*',
        element: <LayoutDashboard />,
        children: [
          {
            path: '',
            element: <PageDashboard />,
            children: [],
          },
          {
            path: '*',
            element: <Navigate to="" replace />,
            children: [],
          },
        ],
      },
      {
        path: 'login/*',
        element: undefined,
        children: [
          {
            path: '',
            element: <PageLogin />,
            children: [],
          },
          {
            path: '*',
            element: <Navigate to="" replace />,
            children: [],
          },
        ],
      },
      {
        path: 'permissions/*',
        element: <LayoutPermissions />,
        children: [
          {
            path: 'policies/*',
            element: undefined,
            children: [
              {
                path: '',
                element: <PagePermissionsPolicies />,
                children: [],
              },
              {
                path: '*',
                element: <Navigate to="" replace />,
                children: [],
              },
            ],
          },
          {
            path: 'roles/*',
            element: undefined,
            children: [
              {
                path: '',
                element: <PagePermissionsRoles />,
                children: [],
              },
              {
                path: '*',
                element: <Navigate to="" replace />,
                children: [],
              },
            ],
          },
          {
            path: '*',
            element: <Navigate to="policies" replace />,
            children: [],
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="dashboard" replace />,
        children: [],
      },
    ],
  },
]

export default routes
