/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from '@/lib/debugLink';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useContent } from "@/hooks/useContent";
import config from "@/config";

// Auth CTA used by the legacy header account area.
const ButtonSignin = ({
  text,
  extraStyle,
}: {
  text?: string;
  extraStyle?: string;
}) => {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const { data: content } = useContent();
  
  const defaultText = content?.global?.ui?.buttons?.getStarted || 'Book a Table';
  const accountLabel = content?.global?.ui?.labels?.account || 'Account';

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      setUser(data.user);
    };

    getUser();
  }, [supabase]);

  if (user) {
    return (
      <Link
        href={config.auth.callbackUrl}
        className={`btn ${extraStyle ? extraStyle : ""}`}
      >
        {user?.user_metadata?.avatar_url ? (
          <img
            src={user?.user_metadata?.avatar_url}
            alt={user?.user_metadata?.name || accountLabel}
            className="w-6 h-6 rounded-full shrink-0"
            referrerPolicy="no-referrer"
            width={24}
            height={24}
          />
        ) : (
          <span className="w-6 h-6 bg-base-300 flex justify-center items-center rounded-full shrink-0">
            {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0)}
          </span>
        )}
        {user?.user_metadata?.name || user?.email || accountLabel}
      </Link>
    );
  }

  return (
    <Link
      className={`btn ${extraStyle ? extraStyle : ""}`}
      href={config.auth.loginUrl}
    >
      {text || defaultText}
    </Link>
  );
};

export default ButtonSignin;
