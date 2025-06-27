"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { createCampaign, updateCampaign } from '@/store/campaignSlice';
import { Campaign, CampaignStatus } from '@/types/campaign';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Badge } from "@/components/atoms/Badge";

const INTEREST_SUGGESTIONS = ["sports", "music", "reading", "travel", "tech"];
const AUDIENCE_SUGGESTIONS = ["audience1", "audience2", "audience3"];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Campaign name must be at least 2 characters.",
  }),
  status: z.nativeEnum(CampaignStatus),
  age: z.string().optional(),
  gender: z.string().optional(),
  interests: z.array(z.string()).optional(),
  audiences: z.array(z.string()).optional(),
});

interface CampaignFormProps {
  campaign?: Campaign;
  onSuccess?: () => void;
}

export function CampaignForm({ campaign, onSuccess }: CampaignFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [interests, setInterests] = useState<string[]>(campaign?.interests || []);
  const [interestInput, setInterestInput] = useState("");
  const [audiences, setAudiences] = useState<string[]>(campaign?.audiences || []);
  const [audienceInput, setAudienceInput] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: campaign?.name || "",
      status: campaign?.status || CampaignStatus.DRAFT,
      age: campaign?.demographics?.[0] || "",
      gender: campaign?.demographics?.[1] || "",
      interests: campaign?.interests || [],
      audiences: campaign?.audiences || [],
    },
  });

  useEffect(() => {
    if (campaign) {
      form.reset({
        name: campaign.name,
        status: campaign.status,
        age: campaign.demographics?.[0] || "",
        gender: campaign.demographics?.[1] || "",
        interests: campaign.interests || [],
        audiences: campaign.audiences || [],
      });
      setInterests(campaign.interests || []);
      setAudiences(campaign.audiences || []);
    }
  }, [campaign, form]);

  function handleAddValue(input: string, setInput: (v: string) => void, values: string[], setValues: (v: string[]) => void) {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      setValues([...values, trimmed]);
    }
    setInput("");
  }

  function handleRemoveValue(value: string, values: string[], setValues: (v: string[]) => void) {
    setValues(values.filter((v) => v !== value));
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const demographics = [values.age, values.gender].filter(Boolean);
    const payload = {
      name: values.name,
      status: values.status.toLowerCase(),
      demographics: demographics.length ? demographics : undefined,
      interests: interests.length ? interests : undefined,
      audiences: audiences.length ? audiences : undefined,
    };
    if (campaign) {
      await dispatch(updateCampaign({ id: campaign.id, campaignData: payload }));
    } else {
      await dispatch(createCampaign(payload));
    }
    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Summer Sale 2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(CampaignStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 18-24" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. male, female, other" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormLabel>Interests (optional)</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {interests.map((interest) => (
              <Badge key={interest} onClick={() => handleRemoveValue(interest, interests, setInterests)} className="cursor-pointer">
                {interest} ×
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Type and press Enter..."
            value={interestInput}
            onChange={e => setInterestInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                handleAddValue(interestInput, setInterestInput, interests, setInterests);
              }
            }}
            className="mb-1"
          />
          <div className="flex flex-wrap gap-1">
            {INTEREST_SUGGESTIONS.filter(s => !interests.includes(s)).map(s => (
              <button type="button" key={s} className="text-xs px-2 py-1 bg-muted rounded hover:bg-accent" onClick={() => handleAddValue(s, setInterestInput, interests, setInterests)}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <FormLabel>Audiences (optional)</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {audiences.map((aud) => (
              <Badge key={aud} onClick={() => handleRemoveValue(aud, audiences, setAudiences)} className="cursor-pointer">
                {aud} ×
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Type and press Enter..."
            value={audienceInput}
            onChange={e => setAudienceInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                handleAddValue(audienceInput, setAudienceInput, audiences, setAudiences);
              }
            }}
            className="mb-1"
          />
          <div className="flex flex-wrap gap-1">
            {AUDIENCE_SUGGESTIONS.filter(s => !audiences.includes(s)).map(s => (
              <button type="button" key={s} className="text-xs px-2 py-1 bg-muted rounded hover:bg-accent" onClick={() => handleAddValue(s, setAudienceInput, audiences, setAudiences)}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <Button type="submit">{campaign ? 'Update Campaign' : 'Create Campaign'}</Button>
      </form>
    </Form>
  );
} 