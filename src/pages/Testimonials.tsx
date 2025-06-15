
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, Users, TrendingUp } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "StreamerMike",
      handle: "@StreamerMike",
      followers: "12.5K",
      tier: "Pro",
      rating: 5,
      quote: "AudioGuard saved my partnership! It caught a copyrighted song in my playlist before it could cause a DMCA strike. The Discord alerts are instant and super helpful.",
      category: "Partnership Protection"
    },
    {
      id: 2,
      name: "GamerGirl_Lily",
      handle: "@GamerGirl_Lily",
      followers: "8.2K",
      tier: "Premium", 
      rating: 5,
      quote: "The AI detection is incredible. It caught background music from a game trailer that I didn't even notice. The auto-mute feature saved my stream without interrupting the gameplay.",
      category: "AI Detection"
    },
    {
      id: 3,
      name: "TechStreams_John",
      handle: "@TechStreams_John",
      followers: "25K",
      tier: "Pro",
      rating: 5,
      quote: "As someone who reviews tech products, I often get demos with copyrighted music. AudioGuard's webhook integration with my streaming setup is seamless. No more manual monitoring!",
      category: "Professional Use"
    },
    {
      id: 4,
      name: "MusicMixMaster",
      handle: "@MusicMixMaster",
      followers: "45K",
      tier: "Premium",
      rating: 5,
      quote: "Even as a music streamer, AudioGuard helps me stay compliant. The custom tracklist feature lets me upload my licensed music database. It's a game-changer for music streamers.",
      category: "Music Streaming"
    },
    {
      id: 5,
      name: "CasualGamer_Sam",
      handle: "@CasualGamer_Sam",
      followers: "3.1K",
      tier: "Free",
      rating: 4,
      quote: "Started with the free tier and the panic button alone saved me twice! The setup guide was super easy to follow. Upgrading to Pro next month for sure.",
      category: "Getting Started"
    },
    {
      id: 6,
      name: "CreativeContent_Zoe",
      handle: "@CreativeContent_Zoe",
      followers: "18K",
      tier: "Pro",
      rating: 5,
      quote: "I create art streams with background music. AudioGuard's sensitivity settings let me fine-tune alerts perfectly. No false positives on ambient sounds, only real music detection.",
      category: "Creative Content"
    }
  ];

  const stats = [
    { label: "Strikes Prevented", value: "2,847", icon: Users },
    { label: "Active Streamers", value: "1,200+", icon: TrendingUp },
    { label: "Average Rating", value: "4.9/5", icon: Star }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Success Stories</h1>
        <p className="text-gray-600 mt-2">
          See how AudioGuard protects streamers from DMCA strikes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6 text-center">
                <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Testimonials Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="h-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    {testimonial.handle} • {testimonial.followers} followers
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={
                    testimonial.tier === 'Premium' ? 'border-purple-200 text-purple-700' :
                    testimonial.tier === 'Pro' ? 'border-blue-200 text-blue-700' :
                    'border-gray-200 text-gray-700'
                  }>
                    {testimonial.tier}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              
              <Badge variant="secondary" className="w-fit">
                {testimonial.category}
              </Badge>
            </CardHeader>
            
            <CardContent>
              <div className="relative">
                <Quote className="h-8 w-8 text-gray-300 absolute -top-2 -left-2" />
                <p className="text-gray-700 italic pl-6">
                  "{testimonial.quote}"
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="bg-primary text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Join Thousands of Protected Streamers</h2>
          <p className="text-blue-100 mb-4">
            Start your DMCA protection today and stream with confidence
          </p>
          <div className="space-x-4">
            <Badge variant="secondary" className="bg-white text-primary">
              Free tier available
            </Badge>
            <Badge variant="secondary" className="bg-white text-primary">
              No setup fees
            </Badge>
            <Badge variant="secondary" className="bg-white text-primary">
              Cancel anytime
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Testimonials;
