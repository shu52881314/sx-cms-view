import Vue from 'vue'
import Router from 'vue-router'

import login from '@/components/login'
import cas from '@/components/cas'
import error from '@/components/error'
import maintenance from '@/components/maintenance'
import layout from '@/components/layout'
import desk from '@/components/desk'
import childView from '@/components/appMain.vue'
import templateTree from '@/components/subModule.vue'

function $importViews(component) {
  require(['@/views/' + component + '.vue'], resolve)
}

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


Vue.use(Router)

export const routes = [
  {
    path: '/login',
    name: '登录',
    component: login,
    hidden: true
  },
  {
    path: '/encrypt',
    name: '加密',
    hidden: true,
    component: r => require.ensure([], () => r(require('@/components/password')), 'password')
  },
  {
    path: '/cas/index',
    component: cas,
    hidden: true,
  },
  {
    path: '/error/maintenance',
    component: maintenance,
    hidden: true,
  },
  {
    path: '/error/index',
    component: error,
    hidden: true,
  },
  {
    path: '/',
    name: '首页',
    component: layout,
    icon: 'iconfont icon-shouye03',
    leaf: true,
    redirect: '/desk',
    children: [{
      path: '/desk',
      component: desk
    }]
  }
]

export const ansycRoutes = [
  {
    path: '/organization',
    meta: {
      id: '',
      parent: ''
    },
    component: layout,
    icon: 'icon-xiaoyuanzuzhi',
    leaf: true,
    children: [
      {
        path: '/teacher/user',
        component: resolve => {
          require(['@/views/teacher/teacher.vue'], resolve)
        }
      },
      // {
      // 	path: 'party',
      // 	component: resolve => { require(['@/views/organization/organization-party.vue'], resolve) }
      // },
      {
        path: 'group',
        component: resolve => {
          require(['@/views/organization/organization-group.vue'], resolve)
        }
      },
      {
        path: 'department',
        component: resolve => {
          require(['@/views/organization/organization-department.vue'], resolve)
        }
      },
      {
        path: 'department/detail',
        hidden: true,
        component: resolve => {
          require(['@/views/organization/organization-department-edit.vue'], resolve)
        }
      },
      {
        path: 'club',
        component: resolve => {
          require(['@/views/organization/organization-club.vue'], resolve)
        }
      },
      {
        path: 'union',
        component: resolve => {
          require(['@/views/organization/organization-union.vue'], resolve)
        }
      },
      {
        path: 'voluntary',
        component: resolve => {
          require(['@/views/organization/organization-voluntary.vue'], resolve)
        }
      },
      {
        path: 'another',
        component: resolve => {
          require(['@/views/organization/organization-another.vue'], resolve)
        }
      },
      {
        path: 'club/edit',
        hidden: true,
        component: resolve => {
          require(['@/views/organization/organization-club-edit.vue'], resolve)
        }
      },
      //    {
      // 	path: 'party/edit',
      // 	hidden: true,
      // 	component: resolve => { require(['@/views/organization/organization-party-edit.vue'], resolve) }
      // },
      {
        path: 'group/edit',
        hidden: true,
        component: resolve => {
          require(['@/views/organization/organization-party-edit.vue'], resolve)
        }
      },
      {
        path: 'club/detail',
        hidden: true,
        component: resolve => {
          require(['@/views/organization/organization-club-detail.vue'], resolve)
        }
      },
      {
        path: 'party/details',
        hidden: true,
        component: resolve => {
          require(['@/views/organization/organization-party-detail.vue'], resolve)
        }
      },
      {
        path: 'group/details',
        hidden: true,
        component: resolve => {
          require(['@/views/organization/organization-party-detail.vue'], resolve)
        }
      },
      {
        path: 'student-union',
        component: resolve => {
          require(['@/views/organization/organization-student-union.vue'], resolve)
        }
      },
      {
        path: 'volunteer',
        component: resolve => {
          require(['@/views/organization/organization-volunteer.vue'], resolve)
        }
      },
      {
        path: 'other',
        component: resolve => {
          require(['@/views/organization/organization-other.vue'], resolve)
        }
      }
    ]

  },
  {
    path: '/executive',
    meta: {
      id: '',
      parent: ''
    },
    component: layout,
    icon: 'icon-dierketang',
    leaf: true,
    redirect: 'department',
    children: [
      {
        path: 'department',
        component: resolve => {
          require(['@/views/organization/organization-department.vue'], resolve)
        }
      },
      {
        path: 'department/detail',
        hidden: true,
        component: resolve => {
          require(['@/views/organization/organization-department-edit.vue'], resolve)
        }
      },
      {
        path: 'teacher/user',
        component: resolve => {
          require(['@/views/teacher/teacher.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/student',
    meta: {
      id: '',
      parent: ''
    },
    component: layout,
    icon: 'icon-dierketang',
    leaf: true,
    redirect: 'campus',
    children: [
      {
        path: 'campus',
        component: resolve => {
          require(['@/views/student/student-campus.vue'], resolve)
        }
      },
      {
        path: 'college',
        component: resolve => {
          require(['@/views/student/student-college.vue'], resolve)
        }
      },
      {
        path: 'major',
        component: resolve => {
          require(['@/views/student/student-major.vue'], resolve)
        }
      },
      {
        path: 'class',
        component: resolve => {
          require(['@/views/student/student-class.vue'], resolve)
        }
      },
      {
        path: 'details',
        hidden: true,
        component: resolve => {
          require(['@/views/student/student-party-detail.vue'], resolve)
        }
      },
      {
        path: 'list',
        component: resolve => {
          require(['@/views/student/student-list.vue'], resolve)
        }
      },
      {
        path: 'leavelist',
        component: resolve => {
          require(['@/views/student/studentleave.vue'], resolve)
        }
      },
      {
        path: 'history',
        component: resolve => {
          require(['@/views/student/student-history.vue'], resolve)
        }
      },
      {
        path: '/report/:id',
        hidden: true,
        component:  resolve => {
          require(['@/views/student/report'], resolve)
        },
      },

    ]
  },
  {
    path: '/communist',
    meta: {
      id: '',
      parent: ''
    },
    component: layout,
    icon: 'icon-dierketang',
    leaf: true,
    redirect: 'activity',
    children: [
      {
        path: 'activity',
        component: resolve => {
          require(['@/views/communist/communist-activity-all.vue'], resolve)
        }
      },
      {
        path: 'activityDown',
        component: resolve => {
          require(['@/views/communist/communist-activity-allDown.vue'], resolve)
        }
      },
      {
        path: 'activity/detail',
        hidden: true,
        component: resolve => {
          require(['@/views/communist/communist-activity-detail.vue'], resolve)
        }
      },
      {
        path: 'historyActivity',
        component: resolve => {
          require(['@/views/communist/communist-history-activity.vue'], resolve)
        }
      },
      {
        path: 'history/detail',
        hidden: true,
        component: resolve => {
          require(['@/views/communist/history-activity-detail.vue'], resolve)
        }
      },
      {
        path: '/history/launch',
        component: resolve => {
          require(['@/views/communist/communist-history-launch.vue'], resolve)
        }
      },
      {
        path: 'award',
        component: resolve => {
          require(['@/views/communist/award.vue'], resolve)
        }
      },
      {
        path: 'awarddetall',
        component: resolve => {
          require(['@/views/communist/awarddetall.vue'], resolve)
        }
      },
      {
        path: 'foul',
        component: resolve => {
          require(['@/views/communist/communist-foul-list.vue'], resolve)
        }
      },
      {
        path: '/activity/launch',
        component: resolve => {
          require(['@/views/communist/communist-activity-launch.vue'], resolve)
        }
      },
      {
        path: '/activity/launchUP',
        component: resolve => {
          require(['@/views/communist/communist-activity-launchxianshang.vue'], resolve)
        }
      },

      {
        path: 'project',
        component: resolve => {
          require(['@/views/communist/communist-project-list.vue'], resolve)
        }
      },
      {
        path: 'prizeInfo',
        component: resolve => {
          require(['@/views/communist/communist-prizeInfo-list.vue'], resolve)
        }
      },
      {
        path: 'project/detail',
        component: resolve => {
          require(['@/views/communist/communist-project-detail.vue'], resolve)
        }
      },
      {
        path: 'projectList/detail',
        component: resolve => {
          require(['@/views/communist/communist-projectShow-detail.vue'], resolve)
        }
      }/*,
      {
        path: '/communist/subject/creat',
        component: resolve => { require(['@/views/answer/subject-creat.vue'], resolve) }
      }*/,
      {
        path: '/communist/project/apply',
        component: resolve => {
          require(['@/views/communist/communist-project-apply-list.vue'], resolve)
        }
      },
      {
        path: '/communist/project/apply/detail',
        component: resolve => {
          require(['@/views/communist/communist-project-apply-detail.vue'], resolve)
        }
      },
      {
        path: 'project/edit',
        hidden: true,
        component: resolve => {
          require(['@/views/communist/communist-project-edit.vue'], resolve)
        }
      },
      {
        path: 'signTask',
        hidden: true,
        component: resolve => {
          require(['@/views/communist/communist-sign-task-list.vue'], resolve)
        }
      },
      {
        path: 'count',
        hidden: true,
        component: resolve => {
          require(['@/views/communist/communist-sign-task-count.vue'], resolve)
        }
      },
      {
        path: 'signTask/detail',
        component: resolve => {
          require(['@/views/communist/communist-sign-task-detail.vue'], resolve)
        }
      },
      {
        path: 'signTask/edit',
        component: resolve => {
          require(['@/views/communist/communist-sign-task-edit.vue'], resolve)
        }
      },
      {
        path: 'plus',
        hidden: true,
        component: resolve => {
          require(['@/views/communist/communist-plus.vue'], resolve)
        }
      },
      {
        path: 'plus/detail',
        hidden: true,
        component: resolve => {
          require(['@/views/communist/communist-plus-show.vue'], resolve)
        }
      },
      {
        path: 'sub',
        hidden: true,
        component: resolve => {
          require(['@/views/communist/communist-sub.vue'], resolve)
        }
      },
      {
        path: 'sub/detail',
        hidden: true,
        component: resolve => {
          require(['@/views/communist/communist-sub-show.vue'], resolve)
        }
      },
    ]

  },
  {
    path: '/analysis',
    meta: {
      id: '',
      parent: ''
    },
    component: layout,
    icon: 'icon-xitongfenxi',
    leaf: true,

    children: [
	  {
	    path: '/analysis/score',
	    component: resolve => {
	      require(['@/views/statistics/scoreAnalyse.vue'], resolve)
	    }
	  },
      {
        path: '/analysis/school',
        component: resolve => {
          require(['@/views/statistics/school.vue'], resolve)
        }
      },
      {
        path: '/analysis/warning',
        component: resolve => {
          require(['@/views/statistics/warning.vue'], resolve)
        }
      },
      {
        path: '/analysis/warningSetting',
        component: resolve => {
          require(['@/views/statistics/warning-setting.vue'], resolve)
        }
      },
      {
        path: '/analysis/sutuo',
        component: resolve => {
          require(['@/views/statistics/classroom.vue'], resolve)
        }
      },
      {
        path: '/analysis/module',
        component: resolve => {
          require(['@/views/statistics/classify.vue'], resolve)
        }
      },
      {
        path: '/analysis/organization',
        component: resolve => {
          require(['@/views/statistics/organization.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/teacher',
    meta: {
      id: '',
      parent: ''
    },
    component: layout,
    icon: 'icon-zhigongguanli',
    leaf: true,
    children: [
      {
        path: '',
        redirect: '/',
        component: templateTree,
        children: [
          // {
          // 	path: '/teacher/role',
          // 	commpents: resolve => { require(['@/views/teacher/role-list.vue'], resolve) }
          // },
          {
            path: '/teacher/user212121',
            component: resolve => {
              require(['@/views/teacher/teacher.vue'], resolve)
            }
          },
        ]
      },
    ]
  },
  {
    path: '/volunteer',
    meta: {
      id: '',
      parent: ''
    },
    component: layout,
    icon: 'icon-iconfontdesktop',
    leaf: true,

    children: [
      {
        path: 'party',
        component: resolve => {
          require(['@/views/organization/organization-party.vue'], resolve)
        }
      },
      {
        path: 'group',
        component: resolve => {
          require(['@/views/organization/organization-group.vue'], resolve)
        }
      },
      {
        path: 'department',
        component: resolve => {
          require(['@/views/organization/organization-department.vue'], resolve)
        }
      },
      {
        path: 'club',
        component: resolve => {
          require(['@/views/organization/organization-voluntary.vue'], resolve)
        }
      },
      {
        path: 'student-union',
        component: resolve => {
          require(['@/views/organization/organization-student-union.vue'], resolve)
        }
      },
      {
        path: 'volunteer',
        component: resolve => {
          require(['@/views/organization/organization-volunteer.vue'], resolve)
        }
      }
    ]

  },
  {
    path: '/practice',
    meta: {
      id: '',
      parent: ''
    },
    component: layout,
    icon: 'icon-iconfontdesktop',
    leaf: true,
    children: [
      {
        path: '',
        redirect: 'party',
        component: templateTree,
        children: [
          {
            path: 'party',
            component: resolve => {
              require(['@/views/organization/organization-party.vue'], resolve)
            }
          },
          {
            path: 'group',
            component: resolve => {
              require(['@/views/organization/organization-group.vue'], resolve)
            }
          },
          {
            path: 'department',
            component: resolve => {
              require(['@/views/organization/organization-department.vue'], resolve)
            }
          },
          {
            path: 'club',
            component: resolve => {
              require(['@/views/organization/organization-voluntary.vue'], resolve)
            }
          },
          {
            path: 'student-union',
            component: resolve => {
              require(['@/views/organization/organization-student-union.vue'], resolve)
            }
          },

          {
            path: 'volunteer',
            component: resolve => {
              require(['@/views/organization/organization-volunteer.vue'], resolve)
            }
          }
        ]
      }
    ]
  },
  {
    path: '/course',
    meta: {
      id: '',
      parent: ''
    },
    component: layout,
    icon: 'icon-iconfontdesktop',
    leaf: true,
    children: [
      {
        path: '',
        redirect: 'party',
        component: templateTree,
        children: [
          {
            path: 'party',
            component: resolve => {
              require(['@/views/organization/organization-party.vue'], resolve)
            }
          },
          {
            path: 'group',
            component: resolve => {
              require(['@/views/organization/organization-group.vue'], resolve)
            }
          },
          {
            path: 'department',
            component: resolve => {
              require(['@/views/organization/organization-department.vue'], resolve)
            }
          },
          {
            path: 'club',
            component: resolve => {
              require(['@/views/organization/organization-voluntary.vue'], resolve)
            }
          },
          {
            path: 'student-union',
            component: resolve => {
              require(['@/views/organization/organization-student-union.vue'], resolve)
            }
          },
          {
            path: 'volunteer',
            component: resolve => {
              require(['@/views/organization/organization-volunteer.vue'], resolve)
            }
          }
        ]
      }
    ]
  },
  {
    path: '/review',
    meta: {
      id: '',
      parent: ''
    },
    component: layout,
    icon: 'icon-iconfontdesktop',
    leaf: true,
    children: [
      {
        path: '',
        redirect: 'party',
        component: templateTree,
        children: [
          {
            path: 'party',
            component: resolve => {
              require(['@/views/organization/organization-party.vue'], resolve)
            }
          },
          {
            path: 'group',
            component: resolve => {
              require(['@/views/organization/organization-group.vue'], resolve)
            }
          },
          {
            path: 'department',
            component: resolve => {
              require(['@/views/organization/organization-department.vue'], resolve)
            }
          },
          {
            path: 'club',
            component: resolve => {
              require(['@/views/organization/organization-voluntary.vue'], resolve)
            }
          },
          {
            path: 'student-union',
            component: resolve => {
              require(['@/views/organization/organization-student-union.vue'], resolve)
            }
          },
          {
            path: 'volunteer',
            component: resolve => {
              require(['@/views/organization/organization-volunteer.vue'], resolve)
            }
          }
        ]
      }
    ]
  },


  {
    path: '/system',
    meta: {
      id: '',
      parent: ''
    },
    component: layout,
    icon: 'icon-xitongguanli',
    leaf: true,

    children: [
      {
        path: 'feedback',
        component: resolve => {
          require(['@/views/system/feedback.vue'], resolve)
        }
      },
      {
        path: 'place',
        component: resolve => {
          require(['@/views/system/system-place.vue'], resolve)
        }
      },
      {
        path: 'term',
        component: resolve => {
          require(['@/views/system/system-term.vue'], resolve)
        }
      },
      {
        path: 'classify',
        component: resolve => {
          require(['@/views/system/system-classify.vue'], resolve)
        }
      },
      {
        path: '/system/logoup',
        component: resolve => {
          require(['@/views/system/system-logoup.vue'], resolve)
        }
      },
      {
        path: '/teacher/role',
        component: resolve => {
          require(['@/views/teacher/role-list.vue'], resolve)
        }
      },
      {
        path: 'sorce_rate',
        component: resolve => {
          require(['@/views/system/system-sorce-rate.vue'], resolve)
        }
      },
      {
        path: '/system/template',
        component: resolve => {
          require(['@/views/system/system-template.vue'], resolve)
        }
      },
      {
        path: '/system/genre',
        component: resolve => {
          require(['@/views/system/system-genre.vue'], resolve)
        }
      },
      {
        path: '/system/template/edit',
        component: resolve => {
          require(['@/views/system/system-template-edit.vue'], resolve)
        }
      },
      {
        path: '/system/template/edit-sub',
        component: resolve => {
          require(['@/views/system/system-template-edit-sub.vue'], resolve)
        }
      },{
        path: '/system/template/edit-practice',
        component: resolve => {
          require(['@/views/system/system-template-edit-practice.vue'], resolve)
        }
      },
      {
        path: 'banner',
        component: resolve => {
          require(['@/views/system/system-banner.vue'], resolve)
        }
      },
      {
        path: 'notice',
        component: resolve => {
          require(['@/views/system/system-notice.vue'], resolve)
        }
      },
      {
        path: 'announcement/add',
        component: resolve => {
          require(['@/views/system/system-notice-edit.vue'], resolve)
        }
      },
      {
        path: 'announcement/show',
        component: resolve => {
          require(['@/views/system/system-notice-show.vue'], resolve)
        }
      }
    ]

  },
  {
    path: '/social',
    meta: {
      id: '',
      parent: ''
    },
    component: layout,
    icon: 'icon-xitongguanli',
    leaf: true,
    children: [
      {
        path: '/social/team',
        component: resolve => {
          require(['@/views/practice/team.vue'], resolve)
        }
      },
      {
        path: '/social/teamdetall',
        component: resolve => {
          require(['@/views/practice/teamdetall.vue'], resolve)
        }
      },
      {
        path: '/social/teamcompile',
        component: resolve => {
          require(['@/views/practice/teamcompile.vue'], resolve)
        }
      },
      {
        path: '/social/teamcompilecy',
        component: resolve => {
          require(['@/views/practice/teamcompilecy.vue'], resolve)
        }
      },
      {
        path: '/social/praxis',
        component: resolve => {
          require(['@/views/practice/praxis.vue'], resolve)
        }
      },
      {
        path: '/social/praxisdetall',
        component: resolve => {
          require(['@/views/practice/praxisdetall.vue'], resolve)
        }
      },
      {
        path: '/social/praxiscompile',
        component: resolve => {
          require(['@/views/practice/praxiscompile.vue'], resolve)
        }
      },
    ]

  },
  {
    path: '/proceeding/wait',
    meta: {
      id: '',
      parent: ''
    },
    component: layout,
    icon: 'icon-xitongguanli',
    leaf: true,
    children: [
      {
        path: '/proceeding/wait/org/list',
        component: resolve => {
          require(['@/views/org/ExamineList.vue'], resolve)
        }
      },
      {
        path: '/proceeding/wait/createpaper',
        component: resolve => {
          require(['@/views/communist/activity-createpaper.vue'], resolve)
        }
      },
      {
        path: '/proceeding/wait/activityTemplate',
        component: resolve => {
          require(['@/views/communist/activity-template.vue'], resolve)
        }
      },
      {
        path: '/proceeding/wait/activityTemplateUP',
        component: resolve => {
          require(['@/views/communist/activity-templatexianshang.vue'], resolve)
        }
      },
      {
        path: '/proceeding/actiqita',
        component: resolve => {
          require(['@/components/actiqita.vue'], resolve)
        }
      },

      {
        path: 'activity/first/activity/detail',
        hidden: true,
        component: resolve => {
          require(['@/views/communist/communist-activity-detail.vue'], resolve)
        }
      },
      {
        path: '/proceeding/wait/org/detail',
        component: resolve => {
          require(['@/views/org/ExamineDetail.vue'], resolve)
        }
      },
      {
        path: '/proceeding/wait/activity/final/auditing',
        component: resolve => {
          require(['@/views/communist/communist-activity-final.vue'], resolve)
        }
      },
      {
        name: '投票',
        path: '/proceeding/wait/activity/vote',
        component: resolve => {
          require(['@/views/communist/communist-activity-vote.vue'], resolve)
        }
      },
      {
        name: '测评',
        path: '/proceeding/wait/activity/appraisal',
        component: resolve => {
          require(['@/views/communist/communist-activity-appraisal.vue'], resolve)
        }
      },
      {
        name: '征集',
        path: '/proceeding/wait/activity/collect',
        component: resolve => {
          require(['@/views/communist/communist-activity-collect.vue'], resolve)
        }
      },
      {
        name: '留言',
        path: '/proceeding/wait/activity/messageboard',
        component: resolve => {
          require(['@/views/communist/communist-activity-messageboard.vue'], resolve)
        }
      },
      {
        name: '问卷',
        path: '/proceeding/wait/activity/questionnaire',
        component: resolve => {
          require(['@/views/communist/communist-activity-questionnaire.vue'], resolve)
        }
      },
      {
        name: '投票',
        path: '/proceeding/wait/activity/votexf',
        component: resolve => {
          require(['@/views/communist/communist-activity-votexf.vue'], resolve)
        }
      },
      {
        name: '测评',
        path: '/proceeding/wait/activity/appraisalxf',
        component: resolve => {
          require(['@/views/communist/communist-activity-appraisalxf.vue'], resolve)
        }
      },
      {
        name: '征集',
        path: '/proceeding/wait/activity/collectxf',
        component: resolve => {
          require(['@/views/communist/communist-activity-collectxf.vue'], resolve)
        }
      },
      {
        name: '留言',
        path: '/proceeding/wait/activity/messageboardxf',
        component: resolve => {
          require(['@/views/communist/communist-activity-messageboardxf.vue'], resolve)
        }
      },
      {
        name: '问卷',
        path: '/proceeding/wait/activity/questionnairexf',
        component: resolve => {
          require(['@/views/communist/communist-activity-questionnairexf.vue'], resolve)
        }
      },
      {
        path: '/proceeding/wait/activity/voteall',
        component: resolve => {
          require(['@/views/communist/communist-activity-voteall.vue'], resolve)
        }
      },
      {

        path: '/proceeding/wait/activity/appraisall',
        component: resolve => {
          require(['@/views/communist/communist-activity-appraisall.vue'], resolve)
        }
      },
      {

        path: '/proceeding/wait/activity/collectall',
        component: resolve => {
          require(['@/views/communist/communist-activity-collectall.vue'], resolve)
        }
      },
      {

        path: '/proceeding/wait/activity/messageboardall',
        component: resolve => {
          require(['@/views/communist/communist-activity-messageboardall.vue'], resolve)
        }
      },
      {

        path: '/proceeding/wait/activity/questionnaireall',
        component: resolve => {
          require(['@/views/communist/communist-activity-questionnaireall.vue'], resolve)
        }
      },
      {
        path: '/apply/detail',
        component: resolve => {
          require(['@/views/communist/communist-project-apply-detail.vue'], resolve)
        }
      },
      {
        path: '/proceeding/wait/activity/report/auditing',
        component: resolve => {
          require(['@/views/communist/communist-activity-finish.vue'], resolve)
        }
      },
      {
        path: '/proceeding/wait/activity/final/auditing/detail',
        hidden: true,
        component: resolve => {
          require(['@/views/communist/communist-activity-detail2.vue'], resolve)
        }
      },

      {
        path: '/proceeding/wait/activity/first/auditing',
        component: resolve => {
          require(['@/views/communist/communist-activity-first.vue'], resolve)
        }
      },
      {
        path: '/proceeding/wait/activity/first/auditingDown',
        component: resolve => {
          require(['@/views/communist/communist-activity-firstDown.vue'], resolve)
        }
      },
      {
        path: '/proceeding/wait/declare/first/auditing',
        component: resolve => {
          require(['@/views/communist/communist-declare-first.vue'], resolve)
        }
      },
      {
        path: '/proceeding/wait/declare/show',
        component: resolve => {
          require(['@/views/communist/communist-declare-detail-show.vue'], resolve)
        }
      },
      {
        path: '/proceeding/wait/studentstatus',
        component: resolve => {
          require(['@/views/communist/studentstatus.vue'], resolve)
        }
      },
      {
        path: '/proceeding/wait/studentstatusinfo',
        component: resolve => {
          require(['@/views/communist/studentstatusinfo.vue'], resolve)
        }
      },
    ]

  }
]
