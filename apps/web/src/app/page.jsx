import { Droplet, Search, Heart, Users, MapPin, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 p-2 rounded-lg">
                <Droplet className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                BloodConnect
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/search"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Search Blood
              </a>
              <a
                href="/emergency"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Emergency Request
              </a>
              <a
                href="/account/signin"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Sign In
              </a>
              <a
                href="/account/signup"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
              >
                Join Now
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Save Lives Through Blood Donation
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with donors, find blood banks, and respond to emergency
              requests. Join our community of life-savers today.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/account/signup"
                className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 font-medium text-lg"
              >
                Become a Donor
              </a>
              <a
                href="/search"
                className="bg-white text-red-600 px-8 py-4 rounded-lg border-2 border-red-600 hover:bg-red-50 font-medium text-lg"
              >
                Find Blood
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Register as Donor</h3>
            <p className="text-gray-600">
              Sign up with your blood group, location, and contact details to
              join our donor network.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Search & Match</h3>
            <p className="text-gray-600">
              Find donors or blood banks near you based on blood group and
              location.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Save Lives</h3>
            <p className="text-gray-600">
              Respond to emergency requests and help patients in need of blood
              transfusions.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-red-100">Registered Donors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-red-100">Blood Banks</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25,000+</div>
              <div className="text-red-100">Lives Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-red-100">Emergency Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose BloodConnect?
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Location-Based Matching
              </h3>
              <p className="text-gray-600">
                Find donors and blood banks near you with our smart
                location-based search.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Verified Donors</h3>
              <p className="text-gray-600">
                All donors are verified by our admin team to ensure safety and
                reliability.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Emergency Alerts</h3>
              <p className="text-gray-600">
                Get instant notifications for critical blood requests in your
                area.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Join a community of compassionate donors committed to saving
                lives.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Every donation counts. Join us today and become a hero.
          </p>
          <a
            href="/account/signup"
            className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 font-medium text-lg inline-block"
          >
            Get Started Now
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Droplet className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">BloodConnect</span>
              </div>
              <p className="text-gray-400">
                Connecting donors with those in need, one donation at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a
                  href="/search"
                  className="block text-gray-400 hover:text-white"
                >
                  Search Blood
                </a>
                <a
                  href="/emergency"
                  className="block text-gray-400 hover:text-white"
                >
                  Emergency Request
                </a>
                <a
                  href="/account/signup"
                  className="block text-gray-400 hover:text-white"
                >
                  Become a Donor
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Organizations</h4>
              <div className="space-y-2">
                <a
                  href="/account/signup"
                  className="block text-gray-400 hover:text-white"
                >
                  Register Blood Bank
                </a>
                <a
                  href="/account/signin"
                  className="block text-gray-400 hover:text-white"
                >
                  Hospital Login
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white">
                  Help Center
                </a>
                <a href="#" className="block text-gray-400 hover:text-white">
                  Contact Us
                </a>
                <a href="#" className="block text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BloodConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
