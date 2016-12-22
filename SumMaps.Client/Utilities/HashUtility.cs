using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace SumMaps.Utilities
{
    public class HashUtility
    {
        public static string CreateHash(string value, int salt)
        {
            using (var sha256 = new SHA256Managed())
            {
                value = (value ?? string.Empty) + salt;
                var data = GetBytes(value, salt);
                var hash = sha256.ComputeHash(data);

                return Convert.ToBase64String(hash);
            }
        }

        public static int CreateRandomSalt()
        {
            var _saltBytes = new Byte[4];

            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(_saltBytes);

                return (((int)_saltBytes[0]) << 24) + (((int)_saltBytes[1]) << 16) + (((int)_saltBytes[2]) << 8) + ((int)_saltBytes[3]);
            }
        }

        private static byte[] GetBytes(string value, int salt)
        {
            var bytes = Encoding.Unicode.GetBytes(value);
            Array.Resize(ref bytes, bytes.Length + 4);

            for (int i = 0; i < 4; i++)
            {
                int offset = 4 - i;
                int shift = i * 8;
                bytes[bytes.Length - offset] = (byte)(salt >> shift);
            }

            return bytes;
        }
    }
}