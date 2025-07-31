import { useEffect, useState } from 'react';
import { BaseLayout } from '@/layouts/base-layout';
import { useAuthStore } from '@/stores/auth';
import { getCGMData } from '@/lib/linkup';
import { TrendArrow } from '@/components/ui/trend-arrow';
import {
  EnterFullScreenIcon,
  GearIcon,
} from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loading';
import { useClearSession } from '@/hooks/session';
import {
  openNewWindow,
  setRedirectTo,
  getUserValue,
  getUserUnit,
  getLocalStorageWindowMode,
  setWindowMode,
} from '@/lib/utils';

const LOW = 70;
const HIGH = 240;

export default function DashboardPage() {
  const { clearSession } = useClearSession();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const country = useAuthStore((state) => state.country);
  const [graphData, setGraphData] = useState<any>({});
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const populateGraphData = async () => {
    try {
      if (!token || !country) {
        throw new Error('Missing authentication data');
      }

      const data = await getCGMData({
        token,
        country,
      });
//.....................
      console.log('CGM API response:', data);

      if (!data) {
        throw new Error('No data received from API');
      }

      setGraphData(data);
      setIsReady(true);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch CGM data:', err);
      setError('Failed to load data. Please try again.');
      clearSession();
    }
  };

  const getColor = (
    value: number,
    targetLow: number,
    targetHigh: number,
  ): string => {
    if (!value) return 'bg-gray-500';
    if (value < LOW) return 'bg-red-500';
    if (value > HIGH) return 'bg-orange-500';
    if ((value < targetLow && value >= LOW) ||
        (value > targetHigh && value <= HIGH)) {
      return 'bg-yellow-500';
    }
    return 'bg-green-500';
  };

  useEffect(() => {
    populateGraphData();

    const interval = setInterval(() => {
      populateGraphData();
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, [token, country]);

  const openSettings = (path: string) => {
    setRedirectTo(path);
    openNewWindow(path, 1024, 768);
  };

  // Window mode handling
  const [currentWindowMode, setCurrentWindowMode] = useState<string | null>(null);

  useEffect(() => {
    const fetchWindowMode = async () => {
      try {
        const mode = await getLocalStorageWindowMode();
        setCurrentWindowMode(mode);
        document.body.style.background =
          mode === 'overlayTransparent' ? 'transparent' : '';
      } catch (err) {
        console.error('Error fetching window mode:', err);
        setCurrentWindowMode('windowed');
      }
    };
    fetchWindowMode();
  }, []);

  const changeToWindowedMode = async () => {
    try {
      await setWindowMode('windowed');
      setCurrentWindowMode('windowed');
      document.body.style.background = '';
    } catch (err) {
      console.error('Error changing window mode:', err);
    }
  };

  if (error) {
    return (
      <BaseLayout className="bg-gray-500 flex justify-center items-center">
        <div className="text-white text-center p-4">
          <p className="text-xl mb-2">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-gray-800 px-4 py-2 rounded"
          >
            Return to Login
          </button>
        </div>
      </BaseLayout>
    );
  }

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (


    <BaseLayout
      className={`${
        currentWindowMode === 'overlayTransparent'
          ? 'transparent'
          : getColor(
              graphData?.glucoseMeasurement?.ValueInMgPerDl,
              graphData?.targetLow ?? LOW,
              graphData?.targetHigh ?? HIGH,
            )
      } flex justify-center items-center draggable`}
    >
      {currentWindowMode === 'windowed' ? (
        <button
          onClick={() => openSettings('/settings/general')}
          className="absolute 2xs:top-5 2xs:right-5 right-0 top-0 outline-none hover:bg-white/20 p-2 rounded-md transition-all no-draggable"
        >
          <GearIcon className="text-white 2xs:h-6 2xs:w-6 w-4 h-4" />
        </button>
      ) : (
        <button
          onClick={changeToWindowedMode}
          className="absolute 2xs:top-2 2xs:right-2 md:top-5 md:right-5 right-0 top-0 outline-none hover:bg-white/20 p-2 rounded-md transition-all no-draggable"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white 2xs:h-6 2xs:w-6 w-4 h-4"
          >
            <defs>
              <filter id="pathShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="1" stdDeviation="2" floodColor="rgba(0, 0, 0, 0.9)"/>
              </filter>
            </defs>
            <path
              d="M2 2.5C2 2.22386 2.22386 2 2.5 2H5.5C5.77614 2 6 2.22386 6 2.5C6 2.77614 5.77614 3 5.5 3H3V5.5C3 5.77614 2.77614 6 2.5 6C2.22386 6 2 5.77614 2 5.5V2.5ZM9 2.5C9 2.22386 9.22386 2 9.5 2H12.5C12.7761 2 13 2.22386 13 2.5V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3H9.5C9.22386 3 9 2.77614 9 2.5ZM2.5 9C2.77614 9 3 9.22386 3 9.5V12H5.5C5.77614 12 6 12.2239 6 12.5C6 12.7761 5.77614 13 5.5 13H2.5C2.22386 13 2 12.7761 2 12.5V9.5C2 9.22386 2.22386 9 2.5 9ZM12.5 9C12.7761 9 13 9.22386 13 9.5V12.5C13 12.7761 12.7761 13 12.5 13H9.5C9.22386 13 9 12.7761 9 12.5C9 12.2239 9.22386 12 9.5 12H12V9.5C12 9.22386 12.2239 9 12.5 9Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
              filter="url(#pathShadow)"
            />
          </svg>
        </button>
      )}

     <div className="flex items-center gap-3">
  {graphData?.glucoseMeasurement?.ValueInMgPerDl !== undefined ? (
    <p className={`${
      currentWindowMode === 'overlayTransparent' ? 'overlay-shadow' : ''
    } text-white font-semibold xs:text-3xl text-xl`}>
      {getUserValue(graphData.glucoseMeasurement.ValueInMgPerDl) + ' ' + getUserUnit()}
    </p>
  ) : (
    <p className="text-white text-xl">No glucose data available</p>
  )}
  <div className={`flex justify-center items-center xs:h-12 xs:w-12 h-6 w-6 rounded-full ${
    currentWindowMode === 'overlayTransparent'
      ? getColor(
          graphData?.glucoseMeasurement?.ValueInMgPerDl,
          graphData?.targetLow ?? LOW,
          graphData?.targetHigh ?? HIGH,
        )
      : 'bg-white/25'
  }`}>
    <TrendArrow
      className="h-9 w-9 text-white"
      trend={graphData?.glucoseMeasurement?.TrendArrow ?? 0}
    />
  </div>
</div>

    </BaseLayout>
  );
}
