import React, { useState } from 'react';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import SettingsLayout from '@/layouts/settings-layout';
import { useAlertStore } from '@/stores/alertStore';
import { useTranslation } from 'react-i18next';
import {
  uploadCustomAlertSoundFile,
  sendRefreshPrimaryWindow,
  sendRefreshAllWindows,
} from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SettingsAlertPage() {

  return (
    <SettingsLayout>
      <></>
    </SettingsLayout>
  );
}
