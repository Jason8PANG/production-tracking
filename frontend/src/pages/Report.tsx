import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  LogOut, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Clock,
  Trash2,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/lib/LanguageContext';

interface Record {
  id: number;
  SiteRef: string;
  Station: string;
  Job: string;
  CompleteDate: string;
  created_at: string;
}

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function Report() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [siteRef, setSiteRef] = useState('');
  const [station, setStation] = useState('');
  
  // 筛选条件
  const [jobFilter, setJobFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // 分页
  const [records, setRecords] = useState<Record[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, pageSize: 10, totalPages: 0 });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const storedSiteRef = sessionStorage.getItem('siteRef');
    const storedStation = sessionStorage.getItem('station');
    
    if (!storedSiteRef || !storedStation) {
      navigate('/');
      return;
    }
    
    setSiteRef(storedSiteRef);
    setStation(storedStation);
  }, [navigate]);

  // 初始加载 + 分页/筛选变化时重新加载
  useEffect(() => {
    if (siteRef && station) {
      fetchRecords(pagination.page);
    }
  }, [siteRef, station, pagination.page]);

  const fetchRecords = async (page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('SiteRef', siteRef);
      params.set('Station', station);
      params.set('page', page.toString());
      params.set('pageSize', pagination.pageSize.toString());
      
      if (jobFilter) params.set('Job', jobFilter);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      
      const response = await fetch(`/api/records?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setRecords(data.data || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Fetch records error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchRecords(1);
  };

  const handleClearFilters = () => {
    setJobFilter('');
    setStartDate('');
    setEndDate('');
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchRecords(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      fetchRecords(newPage);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('siteRef');
    sessionStorage.removeItem('station');
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!jobFilter.trim()) {
      setMessage({ type: 'error', text: t('pleaseEnterJob') });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SiteRef: siteRef,
          Station: station,
          Job: jobFilter.trim(),
          CompleteDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message || t('success') });
        setJobFilter('');
        fetchRecords(pagination.page);
      } else {
        setMessage({ type: 'error', text: data.error || t('submitFailed') });
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('networkError') });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/records/${deleteId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: t('deleted') });
        fetchRecords(pagination.page);
      } else {
        setMessage({ type: 'error', text: data.error || t('deleteFailed') });
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('networkError') });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{t('reportTitle')}</h1>
              <p className="text-sm text-slate-500">
                {siteRef} / {station}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* 语言切换 */}
            <Select value={language} onValueChange={(v) => setLanguage(v as 'zh' | 'en')}>
              <SelectTrigger className="w-28">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* 报工表单 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              {t('completeReport')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="job" className="sr-only">{t('jobNumber')}</Label>
                <Input
                  id="job"
                  placeholder={t('enterJob')}
                  value={jobFilter}
                  onChange={(e) => setJobFilter(e.target.value)}
                  className="h-12 text-lg"
                  disabled={submitting}
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="h-12 px-8"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('submit')}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {t('complete')}
                  </>
                )}
              </Button>
            </form>

            {message && (
              <div className={`mt-4 flex items-center gap-2 p-3 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {message.text}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 报工记录 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              {t('reportRecords')}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({t('total')} {pagination.total} {t('records')})
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Search className="h-4 w-4 mr-2" />
                {t('filter')}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fetchRecords(pagination.page)}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {t('refresh')}
              </Button>
            </div>
          </CardHeader>
          
          {/* 筛选区域 */}
          {showFilters && (
            <CardContent className="border-b bg-slate-50">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="space-y-1">
                  <Label className="text-xs">{t('jobNo')}</Label>
                  <Input
                    placeholder={t('jobNo')}
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                    className="w-40"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t('startTime')}</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t('endTime')}</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    {t('search')}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleClearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    {t('clear')}
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
          
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>{t('noRecords')}</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">{t('seq')}</TableHead>
                      <TableHead>{t('jobNumber')}</TableHead>
                      <TableHead>{t('completeTime')}</TableHead>
                      <TableHead className="w-20">{t('operation')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record, index) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {(pagination.page - 1) * pagination.pageSize + index + 1}
                        </TableCell>
                        <TableCell className="font-mono font-semibold">{record.Job}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(record.CompleteDate)}
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setDeleteId(record.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('deleteRecord')} <strong>{record.Job}</strong> {t('record')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeleteId(null)}>
                                  {t('cancel')}
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleDelete}
                                  disabled={deleting}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {deleting ? t('deleting') : t('confirm')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* 分页 */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {t('page')} {pagination.page} {t('pages')} {pagination.totalPages}，{t('total')} {pagination.total} {t('records')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        {t('prev')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                      >
                        {t('next')}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default Report;
