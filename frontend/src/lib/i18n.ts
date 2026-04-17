export const translations = {
  zh: {
    // 登录页
    loginTitle: '生产跟踪系统',
    loginSubtitle: '请选择公司别和站别登录',
    selectSiteRef: '请选择公司别',
    selectStation: '请先选择公司别',
    selectStationReady: '请选择站别',
    enterReport: '进入报工系统',
    loading: '加载中...',
    loginIn: '登录中...',
    
    // 报工页
    reportTitle: '生产跟踪系统',
    logout: '退出登录',
    completeReport: '完工报工',
    enterJob: '输入工单号，按 Enter 完工',
    submit: '提交中...',
    complete: '完成完工',
    success: '完工报工成功！',
    reportRecords: '报工记录',
    total: '共',
    records: '条',
    filter: '筛选',
    refresh: '刷新',
    noRecords: '暂无报工记录',
    
    // 筛选
    jobNo: '工单号',
    startTime: '开始时间',
    endTime: '结束时间',
    search: '查询',
    clear: '清除',
    
    // 表格
    seq: '序号',
    jobNumber: '工单号',
    completeTime: '完工时间',
    operation: '操作',
    confirmDelete: '确认删除',
    deleteRecord: '确定要删除工单',
    record: '的记录吗？',
    cancel: '取消',
    confirm: '确认删除',
    deleting: '删除中...',
    
    // 分页
    page: '第',
    pages: '页',
    prev: '上一页',
    next: '下一页',
    
    // 提示
    pleaseEnterJob: '请输入工单号',
    duplicateSubmit: '请勿重复提交！该工单已报工。',
    submitFailed: '提交失败',
    networkError: '网络错误，请重试',
    deleted: '记录已删除',
    deleteFailed: '删除失败',
    
    // 补漏提示
    autoFilled: '报工成功！已自动补漏：',
  },
  
  en: {
    // Login Page
    loginTitle: 'Production Tracking System',
    loginSubtitle: 'Select Site and Station to Login',
    selectSiteRef: 'Select Site',
    selectStation: 'Select Site First',
    selectStationReady: 'Select Station',
    enterReport: 'Enter Report System',
    loading: 'Loading...',
    loginIn: 'Logging in...',
    
    // Report Page
    reportTitle: 'Production Tracking System',
    logout: 'Logout',
    completeReport: 'Complete Report',
    enterJob: 'Enter Job Number, Press Enter to Complete',
    submit: 'Submitting...',
    complete: 'Complete',
    success: 'Report submitted successfully!',
    reportRecords: 'Report Records',
    total: 'Total',
    records: 'records',
    filter: 'Filter',
    refresh: 'Refresh',
    noRecords: 'No records found',
    
    // Filter
    jobNo: 'Job Number',
    startTime: 'Start Date',
    endTime: 'End Date',
    search: 'Search',
    clear: 'Clear',
    
    // Table
    seq: 'No.',
    jobNumber: 'Job Number',
    completeTime: 'Complete Time',
    operation: 'Action',
    confirmDelete: 'Confirm Delete',
    deleteRecord: 'Delete job',
    record: 'record?',
    cancel: 'Cancel',
    confirm: 'Confirm',
    deleting: 'Deleting...',
    
    // Pagination
    page: 'Page',
    pages: 'of',
    prev: 'Prev',
    next: 'Next',
    
    // Messages
    pleaseEnterJob: 'Please enter job number',
    duplicateSubmit: 'Do not submit repeatedly! Job already reported.',
    submitFailed: 'Submit failed',
    networkError: 'Network error, please retry',
    deleted: 'Record deleted',
    deleteFailed: 'Delete failed',
    
    // Auto-fill message
    autoFilled: 'Report success! Auto-filled: ',
  }
};

export type Language = 'zh' | 'en';
export type TranslationKey = keyof typeof translations.zh;
