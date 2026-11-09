import supabase from "@/db/Supabase";
import { useStripe } from "@stripe/stripe-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Text, View } from "react-native";

export default function PaymentScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [lesson, setLesson] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  // 1️⃣ Load user session
  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    loadSession();
  }, []);

  // 2️⃣ Load lesson from Supabase
  useEffect(() => {
    const loadLesson = async () => {
      if (!productId) return;

      const { data: lesson, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", productId)
        .single();

      if (error || !lesson) {
        console.error("Lesson not found:", error);
        Alert.alert("Error", "Lesson not found.");
        setLoading(false);
        return;
      }

      setLesson(lesson);
    };
    loadLesson();
  }, [productId]);

  // 3️⃣ Initialize Stripe Payment Sheet
  useEffect(() => {
    if (lesson && session) initializePaymentSheet();
  }, [lesson, session]);

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch("http://192.168.0.164:3000/payment-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: lesson.id,
          userId: session.user.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Payment sheet fetch failed");

      return data;
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message);
      return null;
    }
  };

  const initializePaymentSheet = async () => {
    setLoading(true);
    const data = await fetchPaymentSheetParams();
    if (!data) return setLoading(false);

    const { paymentIntent, ephemeralKey, customer } = data;

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Numecis",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: { name: session?.user?.email || "User" },
    });

    if (error) Alert.alert("Error initializing payment sheet", error.message);
    else setReady(true);

    setLoading(false);
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Payment failed: ${error.message}`);
    } else {
      Alert.alert("✅ Payment confirmed!");
      await handleSuccessfulPayment();
    }
  };

  // 4️⃣ Record purchase
  const handleSuccessfulPayment = async () => {
    if (!session?.user?.id || !lesson) return;

    const { error } = await supabase.from("purchases").upsert({
      user_id: session.user.id,
      purchased: true,
      product_id: lesson.id,
      created_at: new Date(),
    });

    if (error) console.error("Supabase insert error:", error);
    else {
      console.log("✅ Purchase recorded successfully!");
      Alert.alert("Purchase recorded", "Your lesson is now unlocked!");
      router.back();
    }
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 20 }}>Preparing payment...</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Purchase Lesson</Text>
      <Text style={{ fontSize: 16, marginBottom: 30 }}>Price: ${lesson?.price}</Text>
      <Button title="Checkout with Stripe" disabled={!ready} onPress={openPaymentSheet} />
    </View>
  );
}
