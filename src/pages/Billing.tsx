
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Check, Crown, Shield, Zap } from 'lucide-react';

const Billing = () => {
  const { user } = useAuth();
  const [currentTier, setCurrentTier] = useState<'free' | 'pro' | 'premium'>('free');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscriptionTier();
    }
  }, [user]);

  const fetchSubscriptionTier = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      setCurrentTier(data?.subscription_tier || 'free');
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const plans = [
    {
      name: 'Free',
      tier: 'free' as const,
      price: '$0',
      period: 'forever',
      description: 'Basic protection for casual streamers',
      features: [
        'Panic button command',
        'Manual OBS setup guide',
        'Community support',
        'Basic dashboard access'
      ],
      icon: Shield,
      color: 'text-gray-600'
    },
    {
      name: 'Pro',
      tier: 'pro' as const,
      price: '$9.99',
      period: 'per month',
      description: 'Full protection for active streamers',
      features: [
        'Real-time Discord alerts',
        'Alert history dashboard',
        'Adjustable sensitivity',
        'Webhook integration',
        'Priority support',
        'Multiple stream sessions'
      ],
      icon: Zap,
      color: 'text-blue-600',
      popular: true
    },
    {
      name: 'Premium',
      tier: 'premium' as const,
      price: '$19.99',
      period: 'per month',
      description: 'Advanced AI protection for professional streamers',
      features: [
        'AI-powered detection',
        'Auto-muting capability',
        'Custom overlay triggers',
        'Upload custom tracklists',
        'Advanced analytics',
        'White-label options',
        'Dedicated support'
      ],
      icon: Crown,
      color: 'text-purple-600'
    }
  ];

  const handleUpgrade = async (targetTier: 'pro' | 'premium') => {
    setLoading(true);
    // In a real app, this would integrate with Stripe
    // For now, we'll just show a placeholder
    setTimeout(() => {
      alert(`Stripe integration coming soon! You selected ${targetTier} plan.`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-2">
          Choose the right plan to protect your stream
        </p>
      </div>

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>Your active plan and billing information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline" className="mb-2">
                {currentTier.toUpperCase()} TIER
              </Badge>
              <p className="text-sm text-gray-600">
                {currentTier === 'free' 
                  ? 'You are currently on the free plan' 
                  : `Your ${currentTier} subscription is active`}
              </p>
            </div>
            {currentTier !== 'free' && (
              <Button variant="outline" size="sm">
                Manage Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = currentTier === plan.tier;
          
          return (
            <Card 
              key={plan.tier} 
              className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className={`mx-auto p-3 rounded-full bg-gray-100 w-fit`}>
                  <Icon className={`h-6 w-6 ${plan.color}`} />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {plan.price}
                  <span className="text-sm font-normal text-gray-600">/{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full"
                  variant={isCurrentPlan ? "outline" : "default"}
                  disabled={isCurrentPlan || loading}
                  onClick={() => plan.tier !== 'free' && handleUpgrade(plan.tier)}
                >
                  {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>Payment method and billing history</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Stripe integration will be added here for payment processing and billing history.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
