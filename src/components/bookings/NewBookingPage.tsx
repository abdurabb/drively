"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { BookingForm } from "@/src/components/bookings/BookingForm";
import { BookingShell } from "@/src/components/bookings/BookingShell";
import { useAuth } from "@/src/hooks/useAuth";
import { useCreateBooking } from "@/src/hooks/useBookings";
import { useMounted } from "@/src/hooks/useMounted";
import { useVehicle } from "@/src/hooks/useVehicles";
import {
  resolveEntityImage,
  VEHICLE_FALLBACK_IMAGES,
} from "@/src/lib/fallbackImages";

export function NewBookingPage({ vehicleId }: { vehicleId: string }) {
  const router = useRouter();
  const mounted = useMounted();
  const { user, isAuthenticated } = useAuth();
  const vehicleQuery = useVehicle(vehicleId);
  const createBooking = useCreateBooking();
  const vehicle = vehicleQuery.data?.data;

  useEffect(() => {
    if (!mounted || !vehicleId || isAuthenticated) {
      return;
    }

    const next = `/bookings/new?vehicleId=${vehicleId}`;
    router.replace(`/login?redirect=${encodeURIComponent(next)}`);
  }, [mounted, vehicleId, isAuthenticated, router]);

  if (!vehicleId) {
    return (
      <BookingShell>
        <MissingVehicle
          title="Choose a car first"
          body="Open a vehicle and use Proceed to Book to start a request."
        />
      </BookingShell>
    );
  }

  if (!mounted || vehicleQuery.isLoading || !isAuthenticated) {
    return (
      <BookingShell>
        <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="h-96 animate-pulse rounded-3xl bg-gray-200" />
        </main>
      </BookingShell>
    );
  }

  if (user?.role !== "customer") {
    return (
      <BookingShell>
        <MissingVehicle
          title="Customer account required"
          body="Bookings can be created from a customer account."
        />
      </BookingShell>
    );
  }

  if (vehicleQuery.isError || !vehicle) {
    return (
      <BookingShell>
        <MissingVehicle
          title="Vehicle not found"
          body="This car is no longer available to book."
        />
      </BookingShell>
    );
  }

  const image = resolveEntityImage(vehicle, VEHICLE_FALLBACK_IMAGES, vehicle._id);

  return (
    <BookingShell>
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <Link
          href={`/cars/${vehicle._id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to car
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900">
          Request this booking
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-500">
          Send the driver details and rental window. The company reviews the request before payment is available.
        </p>

        {vehicle.status !== "available" ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              This vehicle is currently marked {vehicle.status}. The company may reject the request.
            </p>
          </div>
        ) : null}

        <div className="mt-8">
          <BookingForm
            key={`${vehicle._id}-${user.id}`}
            mode="create"
            submitLabel="Request booking"
            isSubmitting={createBooking.isPending}
            serverError={createBooking.error}
            onDirty={() => createBooking.reset()}
            pricing={{
              title: vehicle.name || `${vehicle.brand} ${vehicle.modelName}`,
              subtitle: `${vehicle.brand} ${vehicle.modelName} · AED ${vehicle.pricePerDay}/day`,
              image,
              pricePerDay: vehicle.pricePerDay,
              pricePerHour: vehicle.pricePerHour,
              securityDeposit: vehicle.securityDeposit,
            }}
            initialValues={{
              driverName: user.name ?? "",
              driverPhone: user.phone ?? "",
            }}
            onSubmit={(payload) => {
              createBooking.mutate(
                { vehicleId: vehicle._id, ...payload },
                {
                  onSuccess: (response) => {
                    router.push(`/bookings/${response.data._id}?created=1`);
                  },
                },
              );
            }}
          />
        </div>
      </main>
    </BookingShell>
  );
}

function MissingVehicle({ title, body }: { title: string; body: string }) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-24 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
        <Info className="h-8 w-8" />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 text-sm text-gray-500">{body}</p>
      <Link
        href="/cars"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0b1220] px-5 py-3 text-sm font-semibold text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Browse cars
      </Link>
    </main>
  );
}
