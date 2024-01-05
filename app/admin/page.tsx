import Link from 'next/link'
import React from 'react'

const Admin = () => {
  return (
    <div>Admin:
      <Link href="/admin/add-product">Add product</Link>
    </div>
  )
}

export default Admin