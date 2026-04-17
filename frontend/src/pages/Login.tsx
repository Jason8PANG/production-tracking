import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, Loader2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/lib/LanguageContext';

function Login() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [siteRef, setSiteRef] = useState('');
  const [station, setStation] = useState('');
  const [sites, setSites] = useState<string[]>([]);
  const [stations, setStations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sitesLoading, setSitesLoading] = useState(true);
  const [stationsLoading, setStationsLoading] = useState(false);

  // 加载公司别列表
  useEffect(() => {
    fetchSites();
  }, []);

  // 当公司别改变时，加载对应的站别列表
  useEffect(() => {
    if (siteRef) {
      fetchStations(siteRef);
    } else {
      setStations([]);
      setStation('');
    }
  }, [siteRef]);

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/records/sites');
      const data = await response.json();
      if (data.success && data.data) {
        setSites(data.data.map((item: any) => item.SiteRef));
      }
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    } finally {
      setSitesLoading(false);
    }
  };

  const fetchStations = async (selectedSite: string) => {
    setStationsLoading(true);
    try {
      const response = await fetch(`/api/records/sites/${encodeURIComponent(selectedSite)}/stations`);
      const data = await response.json();
      if (data.success && data.data) {
        setStations(data.data.map((item: any) => item.Station));
      }
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    } finally {
      setStationsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!siteRef || !station) {
      return;
    }

    // 保存到 sessionStorage
    sessionStorage.setItem('siteRef', siteRef);
    sessionStorage.setItem('station', station);
    
    // 跳转到报工页面
    navigate('/report');
  };

  const isDisabled = !siteRef || !station || loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* 语言切换 */}
      <div className="absolute top-4 right-4">
        <Select value={language} onValueChange={(v) => setLanguage(v as 'zh' | 'en')}>
          <SelectTrigger className="w-28 bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Globe className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="zh">中文</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Factory className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            {t('loginTitle')}
          </CardTitle>
          <CardDescription className="text-slate-500">
            {t('loginSubtitle')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 公司别下拉 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                {language === 'zh' ? '公司别' : 'Site'}
              </label>
              <Select 
                value={siteRef} 
                onValueChange={setSiteRef}
                disabled={sitesLoading}
              >
                <SelectTrigger className="h-12">
                  {sitesLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-muted-foreground">{t('loading')}</span>
                    </div>
                  ) : (
                    <SelectValue placeholder={t('selectSiteRef')} />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site} value={site}>
                      {site}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 站别下拉 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                {language === 'zh' ? '站别' : 'Station'}
              </label>
              <Select 
                value={station} 
                onValueChange={setStation}
                disabled={!siteRef || stationsLoading}
              >
                <SelectTrigger className="h-12">
                  {stationsLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-muted-foreground">{t('loading')}</span>
                    </div>
                  ) : (
                    <SelectValue placeholder={siteRef ? t('selectStationReady') : t('selectStation')} />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {stations.map((stn) => (
                    <SelectItem key={stn} value={stn}>
                      {stn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium"
              disabled={isDisabled}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('loginIn')}
                </>
              ) : (
                t('enterReport')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
