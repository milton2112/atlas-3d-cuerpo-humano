import bpy

print("COLLECTIONS_START")
for collection in bpy.data.collections:
    object_count = len(collection.objects)
    child_count = len(collection.children)
    print(f"{collection.name}\tobjects={object_count}\tchildren={child_count}")
print("COLLECTIONS_END")
