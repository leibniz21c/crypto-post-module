#!/usr/bin/env python3
import sys

from Cryptodome.Cipher import AES
from Cryptodome.Random import get_random_bytes

def add_padding(byte_stream, total_size):
    if len(byte_stream) >= total_size: return byte_stream
    return byte_stream + b'\0'*(total_size - len(byte_stream))
        
if __name__=="__main__":
    # arg check
    if len(sys.argv) != 4: 
        print("Usage: python3 {} [input_filename] [output_filename] [key]".format(sys.argv[0]))
        exit()
    
    # Encoding to utf-8 and adding padding
    key = add_padding(sys.argv[3].encode("utf-8"), 16)
    
    # Input file
    with open(sys.argv[1], "r") as input_file:
        plane_bytes = input_file.read().encode("utf-8")
        
        # AES-EAX 
        aes = AES.new(key, AES.MODE_EAX)
        
        # Encoding
        cipher_bytes, tag = aes.encrypt_and_digest(plane_bytes)
        
        # Output file
        with open(sys.argv[2], "wb") as output_file:
            [output_file.write(x) for x in (aes.nonce, tag, cipher_bytes)]