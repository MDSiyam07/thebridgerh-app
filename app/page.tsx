import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Header */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Wilkommen, cher visiteur !
        </h1>
        <p className="text-xl text-dark-200">
          Choisissez votre rôle pour continuer...
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          
          {/* Section RH */}
          <div className="bg-dark-400 rounded-[32px] p-8 border border-[#FFD700] text-center hover:border-[#FFD700]/80 transition-colors">
            <div className="mb-6">
              {/* Icône RH stylisée */}
              <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center relative">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  </div>
                  {/* Nuages décoratifs */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full opacity-60"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full opacity-40"></div>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Vous êtes un RH ?
            </h2>
            
            <Link 
              href="/admin"
              className="inline-block bg-[#8D0000] text-white px-6 py-3 rounded-[12px] hover:bg-[#720000] transition-colors font-medium"
            >
              Cliquez ici →
            </Link>
          </div>

          {/* Section Candidat */}
          <div className="bg-dark-400 rounded-[32px] p-8 border border-[#FFD700] text-center hover:border-[#FFD700]/80 transition-colors">
            <div className="mb-6">
              {/* Icône Candidat stylisée */}
              <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center relative">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  </div>
                  {/* Lunettes stylisées */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-1 bg-blue-400 rounded-full"></div>
                  </div>
                  {/* Nuages décoratifs */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full opacity-60"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full opacity-40"></div>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Vous êtes candidat ?
            </h2>
            
            <Link 
              href="/candidat"
              className="inline-block bg-[#8D0000] text-white px-6 py-3 rounded-[12px] hover:bg-[#720000] transition-colors font-medium"
            >
              Cliquez ici →
            </Link>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-dark-300 text-sm">
          Made with ❤️ by TheBridge RH
        </p>
      </div>
    </div>
  )
}
