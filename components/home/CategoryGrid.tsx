import Image from "next/image";
import Link from "next/link";

export function CategoryGrid() {
  return (
    <section className="py-24 bg-surface-container-low px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-headline text-4xl font-black uppercase tracking-tight">
              EXPLORAR CATEGORÍAS
            </h2>
            <div className="h-1 w-24 bg-primary mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[600px]">

          {/* ROPA SUPERIOR — tile grande */}
          <Link
            href="/catalog?category=superior"
            className="md:col-span-2 relative group cursor-pointer overflow-hidden h-[300px] md:h-auto"
          >
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5Mc-dR3Grb7lw8i5GVZcIljnDfnAlF1zRvm0F6_eUE3xgSPZjeklAZ78PP7irkW_IOhtnoymzlJZ5q2sBYsr8tonZmCTM58hq_2FFWTr7lYRBWzaqRbJ9WaJoCcqUNXvhbNm630IOtJ5HfVjLUAklI9XLLL4pbveeS22iomS3dV7duvmIiFBq8ih_9oOeeRi0Yxi9_bZdSgvouyJbFsaOMWcq_-1z_r55sBqs0q2CXiheRwISJWCpDDmWuYP30OWcOVZ0SCdft5I"
              alt="Ropa superior táctica"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
            <div className="absolute bottom-8 left-8">
              <h3 className="font-headline text-4xl font-black text-white mb-2">
                ROPA SUPERIOR
              </h3>
              <p className="text-tertiary font-label text-xs tracking-widest uppercase">
                CAMISETAS / CHAQUETAS / CHALECOS
              </p>
            </div>
          </Link>

          {/* Columna ROPA INFERIOR + CALZADO */}
          <div className="flex flex-col gap-4">
            <Link
              href="/catalog?category=inferior"
              className="h-[140px] md:h-1/2 relative group cursor-pointer overflow-hidden"
            >
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWnqqQjAfHBZWuOACf95K-Rg5thb7LoHifk8X-4CbEBM6E2_zP8atG2savdG6QiDvCBxBS4VcNoFzXCrAl2xsVEcXqMubOFRWixttAcEwhbgIJvNl8Cbq2PnutdA_xa5oPFHtFXBqi7uU56gCtNw5iv8RcHZdiDowogwsMcEkrRVgs5Hp4kQ0M0n28IZcbdLqcSxqhLDZUw8cXCdhK4alOLFzORaiYldpn9Gy0OWxKMIbI3e_MWOwD675e9qdrzPFlU4vhH0GOEuY"
                alt="Ropa inferior táctica"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-6 left-6">
                <h3 className="font-headline text-2xl font-black text-white">
                  ROPA INFERIOR
                </h3>
              </div>
            </Link>
            <Link
              href="/catalog?category=calzado"
              className="h-[140px] md:h-1/2 relative group cursor-pointer overflow-hidden"
            >
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJU7vnWy7CV_3tjsyDTdpi681qHZtclR8W86rVV5_gef44KMzyT9eR8H16C3YZlihSO3t7Fhpp2aDKKlutJtXc1oyx_Y8kDhMgMFLymbaPm9fxp4macRpigje9ytKc6BmH-9qzeu8y-CMev9rSbNgfgEMhIwnzfTB-ngirIM5YreyF5enLrpdj5N-Ava0w2SLuqNkgOrEwrglSnSFBqR93nJXn8_12HHsuVYydkIuGFedYOU8Nm4jJ4fJufddJ1J0wGOtA-Y3yjMI"
                alt="Calzado táctico"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-6 left-6">
                <h3 className="font-headline text-2xl font-black text-white">
                  CALZADO
                </h3>
              </div>
            </Link>
          </div>

          {/* ACCESORIOS — sin cambios */}
          <Link
            href="/catalog?category=accessories"
            className="relative group cursor-pointer overflow-hidden h-[280px] md:h-auto"
          >
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf1uUQkDuf1Wi8QZ3v0X4xIXPJz40Hr-s3rMyeew_RIDjzfvSshzJ5MrDhokxlgazLuT9B4nXCQI7LqcwGzGjbQitmHXCia477i-sDclGcNx9raVEd97IY3v4o_cofhS4axeZp6FLRI2_JiQ5UBmJAUgODC1sNQdvh2pIW-Y0zhopGW79IFUvx31rBTTfCnvGxJfZSYOqCFjiM7-iOQCS2SNOteI2zkcfLX3lWcH46O8b1XTwpBHuajcYsfXmb6EzzPRndu4VWZ2w"
              alt="Accesorios tácticos"
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
            <div className="absolute bottom-8 left-8">
              <h3 className="font-headline text-3xl font-black text-white">
                ACCESORIOS
              </h3>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
