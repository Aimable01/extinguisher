"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { login } from "@/services/authService";

const schema = z.object({
  email: z.string().email(),

  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await login(data.email, data.password);

      sessionStorage.setItem("otp_email", data.email);

      toast.success("OTP sent successfully");

      router.push("/verify-otp");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="
      min-h-screen
      flex items-center justify-center
      bg-gray-950
    "
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
          bg-gray-900
          p-8
          rounded-xl
          w-full
          max-w-md
          space-y-5
        "
      >
        <h1 className="text-2xl font-bold">Admin Login</h1>

        <Input
          label="Email"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          type="password"
          label="Password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Button loading={isSubmitting}>Continue</Button>
      </form>
    </div>
  );
}
