import { useState, useEffect } from 'react';
import { Star, Share2, Users, Copy } from 'lucide-react';
import { SupabaseService } from '../lib/supabase';
interface UserProfile {
  email: string;
  username: string;
}

export default function MorePointsSection() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    email: 'mojev86560@nctime.c...',
    username: 'Unknown'
  });
  const [referralLink, setReferralLink] = useState('https://app.flowvahub.com/signup?ref=unkno3567');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await SupabaseService.getSession();

        if (!error && data.session?.user) {
          const user = data.session.user;
          const email = user.email || 'mojev86560@nctime.c...';
          const emailPrefix = email.split('@')[0];
          const randomNum = Math.floor(Math.random() * 900) + 100;
          const username = `${emailPrefix}${randomNum}`;

          setUserProfile({
            email,
            username
          });

          setReferralLink(`https://app.flowvahub.com/signup?ref=${username}`);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const message = 'Check out Flowva - manage your tools better!';
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message + ' ' + referralLink)}`
    };
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
      {/* Earn More Points Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-8 bg-purple-600 rounded-full"></div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Earn More Points
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Refer Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Refer and win 10,000 points!
              </h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Invite 3 friends by Nov 20 and earn a chance to be one of 5 winners of{' '}
              <span className="text-purple-600 font-semibold">10,000 points</span>. Friends must complete onboarding to qualify.
            </p>
          </div>

          {/* Share Your Stack Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Share2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Share Your Stack
                </h3>
                <p className="text-sm text-gray-600">Earn +25 pts</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">Share your tool stack</p>
              <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Refer & Earn Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-8 bg-purple-600 rounded-full"></div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Refer & Earn
          </h2>
        </div>

        {/* Share Your Link Card */}
        <div className="bg-purple-50 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Share Your Link
              </h3>
              <p className="text-sm text-gray-700">
                Invite friends and earn 25 points when they join!
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-1">0</div>
              <div className="text-sm text-gray-600">Referrals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-1">0</div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
          </div>

          {/* Referral Link */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your personal referral link:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleCopyLink}
                className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center"
                title="Copy link"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 mt-2">Link copied to clipboard!</p>
            )}
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleShare('facebook')}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
              title="Share on Facebook"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>

            <button
              onClick={() => handleShare('twitter')}
              className="w-12 h-12 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
              title="Share on X (Twitter)"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>

            <button
              onClick={() => handleShare('linkedin')}
              className="w-12 h-12 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-colors"
              title="Share on LinkedIn"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </button>

            <button
              onClick={() => handleShare('whatsapp')}
              className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
              title="Share on WhatsApp"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}