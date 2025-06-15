
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DiscordInteraction {
  type: number
  data?: {
    name: string
    options?: Array<{
      name: string
      value: string | number | boolean
    }>
  }
  member?: {
    user: {
      id: string
      username: string
    }
  }
  channel_id?: string
  guild_id?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    if (req.method === 'POST') {
      const body = await req.json()
      
      // Handle Discord interactions (slash commands)
      if (body.type === 1) {
        // Ping/Pong for Discord verification
        return new Response(JSON.stringify({ type: 1 }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      if (body.type === 2) {
        // Application command
        return await handleSlashCommand(body, supabase)
      }

      // Handle webhook calls from our app (for sending alerts)
      if (body.action === 'send_alert') {
        return await sendAlert(body, supabase)
      }

      if (body.action === 'test_alert') {
        return await sendTestAlert(body, supabase)
      }
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Discord bot error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleSlashCommand(interaction: DiscordInteraction, supabase: any) {
  const commandName = interaction.data?.name
  const userId = interaction.member?.user?.id
  const channelId = interaction.channel_id

  console.log('Handling slash command:', commandName, 'from user:', userId)

  switch (commandName) {
    case 'panic':
      return await handlePanicCommand(interaction, supabase)
    case 'status':
      return await handleStatusCommand(interaction, supabase)
    case 'settings':
      return await handleSettingsCommand(interaction, supabase)
    case 'test-alert':
      return await handleTestAlertCommand(interaction, supabase)
    default:
      return createDiscordResponse('Unknown command!')
  }
}

async function handlePanicCommand(interaction: DiscordInteraction, supabase: any) {
  const embed = {
    title: '🚨 PANIC BUTTON ACTIVATED',
    description: '**IMMEDIATE ACTION REQUIRED**\n\nMute your stream audio NOW to avoid DMCA issues!',
    color: 0xFF0000, // Red
    fields: [
      {
        name: '⚡ Quick Actions',
        value: '• Mute your OBS audio source\n• Check what music is playing\n• Consider ending the stream if needed',
        inline: false
      }
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: 'AudioGuard Protection System'
    }
  }

  await sendDiscordMessage(interaction.channel_id!, { embeds: [embed] })
  
  return createDiscordResponse('🚨 Panic alert sent! Check your stream immediately.')
}

async function handleStatusCommand(interaction: DiscordInteraction, supabase: any) {
  // Get user settings from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('discord_id', interaction.member?.user?.id)
    .single()

  const embed = {
    title: '🛡️ AudioGuard Status',
    color: 0x00FF00, // Green
    fields: [
      {
        name: '📡 Protection Status',
        value: profile ? '✅ Active' : '❌ Not Connected',
        inline: true
      },
      {
        name: '📊 Tier',
        value: profile?.subscription_tier?.toUpperCase() || 'FREE',
        inline: true
      },
      {
        name: '🔧 Setup',
        value: profile ? 'Complete' : 'Pending',
        inline: true
      }
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: 'AudioGuard Protection System'
    }
  }

  await sendDiscordMessage(interaction.channel_id!, { embeds: [embed] })
  
  return createDiscordResponse('Status check complete!')
}

async function handleSettingsCommand(interaction: DiscordInteraction, supabase: any) {
  const { data: settings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('discord_channel_id', interaction.channel_id)
    .single()

  const embed = {
    title: '⚙️ AudioGuard Settings',
    color: 0x0099FF, // Blue
    fields: [
      {
        name: '🎯 Alert Sensitivity',
        value: settings?.alert_sensitivity ? `${Math.round(settings.alert_sensitivity * 100)}%` : 'Not configured',
        inline: true
      },
      {
        name: '🚨 Panic Button',
        value: settings?.panic_button_enabled ? '✅ Enabled' : '❌ Disabled',
        inline: true
      },
      {
        name: '🔇 Auto-Mute',
        value: settings?.auto_mute_enabled ? '✅ Enabled' : '❌ Disabled (Pro)',
        inline: true
      }
    ],
    description: 'Configure your settings at [AudioGuard Dashboard](https://your-app-url.com/settings)',
    timestamp: new Date().toISOString(),
    footer: {
      text: 'AudioGuard Protection System'
    }
  }

  await sendDiscordMessage(interaction.channel_id!, { embeds: [embed] })
  
  return createDiscordResponse('Settings displayed!')
}

async function handleTestAlertCommand(interaction: DiscordInteraction, supabase: any) {
  const testAlerts = [
    {
      track_title: 'Shape of You',
      track_artist: 'Ed Sheeran',
      risk_level: 'high',
      confidence_score: 0.95
    },
    {
      track_title: 'Blinding Lights',
      track_artist: 'The Weeknd',
      risk_level: 'critical',
      confidence_score: 0.98
    },
    {
      track_title: 'Watermelon Sugar',
      track_artist: 'Harry Styles',
      risk_level: 'medium',
      confidence_score: 0.82
    }
  ]

  const randomAlert = testAlerts[Math.floor(Math.random() * testAlerts.length)]
  
  const embed = createAlertEmbed(randomAlert, true)
  await sendDiscordMessage(interaction.channel_id!, { embeds: [embed] })
  
  return createDiscordResponse('🧪 Test alert sent!')
}

async function sendAlert(body: any, supabase: any) {
  const { alert, channelId } = body
  
  const embed = createAlertEmbed(alert, false)
  await sendDiscordMessage(channelId, { embeds: [embed] })
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function sendTestAlert(body: any, supabase: any) {
  const { channelId, userId } = body
  
  const testAlert = {
    track_title: 'Test Song',
    track_artist: 'Test Artist',
    risk_level: 'medium',
    confidence_score: 0.85
  }
  
  const embed = createAlertEmbed(testAlert, true)
  await sendDiscordMessage(channelId, { embeds: [embed] })
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

function createAlertEmbed(alert: any, isTest: boolean = false) {
  const riskColors = {
    low: 0x00FF00,      // Green
    medium: 0xFFFF00,   // Yellow
    high: 0xFF8000,     // Orange
    critical: 0xFF0000  // Red
  }

  const riskEmojis = {
    low: '🟢',
    medium: '🟡',
    high: '🟠',
    critical: '🔴'
  }

  return {
    title: `${isTest ? '🧪 TEST ALERT: ' : ''}${riskEmojis[alert.risk_level]} DMCA Risk Detected`,
    description: isTest ? 'This is a test alert to verify your setup.' : 'Potential copyrighted content detected in your stream!',
    color: riskColors[alert.risk_level],
    fields: [
      {
        name: '🎵 Track',
        value: `**${alert.track_title}**\nby ${alert.track_artist}`,
        inline: true
      },
      {
        name: '⚠️ Risk Level',
        value: `**${alert.risk_level.toUpperCase()}**`,
        inline: true
      },
      {
        name: '📊 Confidence',
        value: `${Math.round(alert.confidence_score * 100)}%`,
        inline: true
      },
      {
        name: '🎯 Recommended Action',
        value: getRiskRecommendation(alert.risk_level),
        inline: false
      }
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: isTest ? 'AudioGuard Test System' : 'AudioGuard Protection System'
    }
  }
}

function getRiskRecommendation(riskLevel: string): string {
  switch (riskLevel) {
    case 'critical':
      return '🚨 **IMMEDIATE ACTION**: Mute stream audio now!'
    case 'high':
      return '⚡ **URGENT**: Consider muting or changing audio source'
    case 'medium':
      return '⚠️ **CAUTION**: Monitor closely, prepare to mute'
    case 'low':
      return '📝 **INFO**: Low risk, but stay aware'
    default:
      return '📊 Monitor your audio content'
  }
}

async function sendDiscordMessage(channelId: string, message: any) {
  const botToken = Deno.env.get('DISCORD_BOT_TOKEN')
  
  const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bot ${botToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })

  if (!response.ok) {
    console.error('Failed to send Discord message:', await response.text())
    throw new Error('Failed to send Discord message')
  }

  return response.json()
}

function createDiscordResponse(content: string, ephemeral: boolean = true) {
  return new Response(JSON.stringify({
    type: 4,
    data: {
      content,
      flags: ephemeral ? 64 : 0
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
