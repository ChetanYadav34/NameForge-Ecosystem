import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { Toast } from '@lexforge/ui';

export const NotificationSystem = () => {
  const { notifications, removeNotification } = useUIStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {notifications.map((notif) => (
        <div key={notif.id} className="pointer-events-auto">
          <Toast 
            title={notif.type.toUpperCase()} 
            description={notif.message} 
            onClose={() => removeNotification(notif.id)} 
            variant={notif.type === 'info' ? 'default' : notif.type} 
          />
        </div>
      ))}
    </div>
  );
};
